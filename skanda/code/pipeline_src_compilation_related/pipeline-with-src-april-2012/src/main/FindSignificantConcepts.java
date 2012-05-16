package main;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import ru.sscc.spline.Spline;
import ru.sscc.spline.polynomial.POddSplineCreator;
import ru.sscc.util.CalculatingException;

import umontreal.iro.lecuyer.functionfit.SmoothingCubicSpline;
import utilities.Utilities;

public class FindSignificantConcepts {

	// public static final double alpha = 0.05;

	// public static List<Double> pValues;
	// public static double alpha;

	public static void main(String[] args) throws IOException {
		// read in p values from a file
		BufferedReader input = new BufferedReader(new FileReader(args[0]));
		String line = null;
		int minRepetitions = -1;
		Map<Concept, ArrayList<Double>> pValues = new HashMap<Concept, ArrayList<Double>>();
		while ((line = input.readLine()) != null) {
			String[] components = line.split("\t");
			Concept concept = new Concept(components[0]);
			String[] pValueStrs = components[1].split(",|\\s");
			if (pValueStrs.length == 0) {
				continue;
			}
			if (minRepetitions < 0 || pValueStrs.length < minRepetitions) {
				minRepetitions = pValueStrs.length;
			}
			// System.out.println(minRepetitions);
			pValues.put(concept, new ArrayList<Double>());
			for (int i = 0; i < pValueStrs.length; ++i) {
				try {
					pValues.get(concept).add(Double.parseDouble(pValueStrs[i]));
				} catch (NumberFormatException e) {
					System.err.println("Error: nonnumeral value " + pValueStrs[i] + " for entry " + concept);
					pValues.remove(concept);
				} catch (NullPointerException e) {
					// concept does not exist - removed because of invalid entry
				}
			}
		}
//		System.out.println(minRepetitions);
		input.close();

		for (MHC mhc : MHC.values()) {
			Map<Concept, List<Double>> results = new HashMap<Concept, List<Double>>();
			for (int i = 0; i < minRepetitions; ++i) {
				List<Concept> concepts = new ArrayList<Concept>();
				List<Double> pValueList = new LinkedList<Double>();
				for (Concept concept : pValues.keySet()) {
					concepts.add(concept);
					pValueList.add(pValues.get(concept).get(i));
				}
				// System.out.println(map);
				List<SigValue> list = run(pValueList, mhc, 0.05);
				for (int conceptIndex = 0; conceptIndex < pValues.keySet().size(); ++conceptIndex) {
					SigValue sigValue = list.get(conceptIndex);
					if (sigValue.isSignificant) {
						Concept concept = concepts.get(conceptIndex);
						if (!results.containsKey(concept)) {
							results.put(concept, new LinkedList<Double>());
						}
						results.get(concept).add(sigValue.value);
					}
				}
			}
			String outputFile = args[1] + "_" + mhc.name() + ".txt";
			Utilities.writeLineToFile(Entry.header(), outputFile);
			List<Entry> entries = new ArrayList<Entry>();
			for (Concept concept : results.keySet()) {
				entries.add(new Entry(concept, new LinkedList<Double>(), results.get(concept)));
			}
			Collections.sort(entries);
			for (Entry entry : entries) {
				Utilities.appendLineToFile(entry.toString(), outputFile);
			}
		}
	}

	public static List<SigValue> run(List<Double> pValues, MHC correctionType, double alpha) {
		List<Double> sigValues = null;

		switch (correctionType) {
		case BONFERRONI:
			sigValues = bonferroni(pValues);
			break;
		case BENJAMINI_HOCHBERG:
			sigValues = fdrBenjamini(pValues);
			break;
		case NONE:
			sigValues = noCorrection(pValues);
			break;
		case STOREY:
			sigValues = fdrStorey(pValues);
			break;
		default:
			throw new IllegalArgumentException("Correction " + correctionType + " is not supported");
		}

		List<Boolean> sigFlags = selectSignificant(sigValues, correctionType, alpha);
		List<SigValue> result = new LinkedList<SigValue>();
		for (int i = 0; i < sigValues.size(); ++i) {
			result.add(new SigValue(sigValues.get(i), sigFlags.get(i)));
		}
		return result;
	}

	public static List<Boolean> selectSignificant(List<Double> sigValues, MHC correctionType, double alpha) {
		List<Boolean> result = new LinkedList<Boolean>();
		switch (correctionType) {
		case BENJAMINI_HOCHBERG:
			int m = sigValues.size();

			// set all results to false
			for (int i = 0; i < m; ++i) {
				result.add(false);
			}

			double[] sortedSigValues = new double[m];
			List<Pair<Integer, Double>> sortedSigValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
			for (int i = 0; i < m; ++i) {
				sortedSigValuesIndex.add(new Pair<Integer, Double>(i, sigValues.get(i)));
			}
			Collections.sort(sortedSigValuesIndex);
			for (int i = 0; i < m; ++i) {
				sortedSigValues[i] = sortedSigValuesIndex.get(i).getValue();
			}

			int k = 0;
			for (int i = 0; i < m; ++i) {
				if (sortedSigValues[i] < alpha) {
					k = i + 1;
				}
			}
			for (int i = 0; i < k; ++i) {
				result.set(sortedSigValuesIndex.get(i).getKey(), true);
			}
			break;
		case BONFERRONI:
			alpha /= sigValues.size();
		default:
			for (Double sigValue : sigValues) {
				if (sigValue < alpha) {
					result.add(true);
				} else {
					result.add(false);
				}
			}
			break;
		}
		return result;
	}

	public static List<Double> fdrStorey(List<Double> pValues) {
		System.out.println("Computing Storey correction");

		int m = pValues.size();
		double[] sortedPValues = new double[m];
		List<Pair<Integer, Double>> sortedPValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
		for (int i = 0; i < m; ++i) {
			sortedPValuesIndex.add(new Pair<Integer, Double>(i, pValues.get(i)));
		}
		Collections.sort(sortedPValuesIndex);
		for (int i = 0; i < m; ++i) {
			sortedPValues[i] = sortedPValuesIndex.get(i).getValue();
		}

		double[] lambda = new double[96];
		double[] pi0 = new double[96];
		for (int i = 0; i < 96; ++i) {
			lambda[i] = (double) i / 100;
			pi0[i] = (double) Utilities.numExceeding(sortedPValues, lambda[i]) / m / (1 - lambda[i]);
		}
		for (int i = 0; i < 96; ++i) {
			System.out.print("" + /* lambda[i] + ":" + */pi0[i] + " ");
		}
		System.out.println("");
		// System.out.println(Utilities.colToString(Arrays.asList(pi0), " "));

		// quadratic fit
		// double pi0_1 = (new PolynomialFit(new PairedData(lambda, pi0), 2)).getPolynomial().eval(1.0);

		// cubic smoothing spline
		double pi0_1 = 1.0;
//		try {
//			POddSplineCreator splineCreator = new POddSplineCreator(2, 0.0, 0.01, 96);
//			Spline spline = splineCreator.createSpline(2, 0.0, 0.01, 96, pi0);
//			pi0_1 = spline.value(1.0);
//			System.out.println("Estimate of pi0_1: " + pi0_1);
//			System.out.println("Evaluation of smoothing spline over 0:0.01:1");
//			for (int i = 0; i <= 100; ++i) {
//				System.out.print("" + spline.value((double) i / 100) + " ");
//			}
//			System.out.println();
//		} catch (CalculatingException e) {
//			System.out.println("Creation of smoothing spline failed; using default value pi0_1 = 1.0");
//		}
		double rho = 0.94;
		SmoothingCubicSpline fit = new SmoothingCubicSpline(lambda, pi0, rho);
		pi0_1 = fit.evaluate(1.0);
		System.out.println("Estimate of pi0_1: " + pi0_1);
		System.out.println("Evaluation of smoothing spline over 0:0.01:1");
		for (int i = 0; i <= 100; ++i) {
			System.out.print("" + fit.evaluate((double) i / 100) + " ");
		}
		System.out.println();

		double[] sortedQValues = new double[m];
		for (int i = 0; i < m; ++i) {
			sortedQValues[i] = pi0_1 * sortedPValues[m - 1];
		}

		for (int i = m - 2; i >= 0; --i) {
			double a = sortedQValues[i + 1];
			double b = pi0_1 * m * sortedPValues[i] / (i + 1);
			sortedQValues[i] = a < b ? a : b;
		}
		System.out.println("Sorted q values");
		System.out.println(Arrays.toString(sortedQValues));
		
		// copy to original order
		List<Double> qValues = new ArrayList<Double>(m);
		// initialize all of list's values to be zero - this will be overwritten
		// necessary to increase size of list to m
		for (int i = 0; i < m; ++i) {
			qValues.add(0.0);
		}
		for (int i = 0; i < m; ++i) {
			qValues.set(sortedPValuesIndex.get(i).getKey(), sortedQValues[i]);
		}
//		System.out.println(qValues);
		return qValues;
	}

	public static List<Double> noCorrection(List<Double> pValues) {
		return pValues;
	}

	public static List<Double> fdrBenjamini(List<Double> pValues) {
		int m = pValues.size();
		double[] sortedPValues = new double[m];
		List<Pair<Integer, Double>> sortedPValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
		for (int i = 0; i < m; ++i) {
			sortedPValuesIndex.add(new Pair<Integer, Double>(i, pValues.get(i)));
		}
		Collections.sort(sortedPValuesIndex);
		for (int i = 0; i < m; ++i) {
			sortedPValues[i] = sortedPValuesIndex.get(i).getValue();
		}

		double[] sortedQValues = new double[m];
		for (int i = 1; i <= m; ++i) {
			sortedQValues[i - 1] = m * sortedPValues[i - 1] / i;
		}

		// copy to original order
		List<Double> qValues = new ArrayList<Double>(m);
		// initialize all of list's values to be zero - this will be overwritten
		// necessary to increase size of list to m
		for (int i = 0; i < m; ++i) {
			qValues.add(0.0);
		}
		for (int i = 0; i < m; ++i) {
			qValues.set(sortedPValuesIndex.get(i).getKey(), sortedQValues[i]);
		}
//		System.out.println(qValues);
		return qValues;
	}

	public static List<Double> bonferroni(List<Double> pValues) {
		List<Double> result = new LinkedList<Double>();
		for (Double pValue : pValues) {
			result.add(pValue);
		}
		return result;
	}
}
