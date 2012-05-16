package main2;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import umontreal.iro.lecuyer.functionfit.SmoothingCubicSpline;
import utilities.Utilities;

public enum MHC {
	BONFERRONI("Bonferroni"), BENJAMINI_HOCHBERG("Benjamini-Hochberg_FDR"), NONE("None"), STOREY("Storey_FDR");
	
	private final String name;
	
	private MHC(String name) {
		this.name = name;
	}
	
	public String toString() {
		return name;
	}
	
	public static List<SigValue> run(List<Double> pValues, MHC correctionType, double alpha) {
		if (pValues.isEmpty()) {
			return new LinkedList<SigValue>();
		}
		
		List<Double> sigValues = correctionType.correct(pValues);
//
//		switch (correctionType) {
//		case BONFERRONI:
//			sigValues = bonferroni(pValues);
//			break;
//		case BENJAMINI_HOCHBERG:
//			sigValues = fdrBenjamini(pValues);
//			break;
//		case NONE:
//			sigValues = noCorrection(pValues);
//			break;
//		case STOREY:
//			sigValues = fdrStorey(pValues);
//			break;
//		default:
//			throw new IllegalArgumentException("Correction " + correctionType + " is not supported");
//		}

		List<Boolean> sigFlags = selectSignificant(pValues, sigValues, correctionType, alpha);
		List<SigValue> result = new LinkedList<SigValue>();
		for (int i = 0; i < sigValues.size(); ++i) {
			result.add(new SigValue(sigValues.get(i), sigFlags.get(i)));
		}
		return result;
	}

	public List<Double> correct(List<Double> pValues) {
		List<Double> results = null;
		
		switch(this) {
		case BENJAMINI_HOCHBERG:
			results = fdrBenjamini(pValues);
			break;
		case BONFERRONI:
			results = bonferroni(pValues);
			break;
		case NONE:
			results = noCorrection(pValues);
			break;
		case STOREY:
			results = fdrStorey(pValues);
			break;
		default:
			throw new IllegalArgumentException("Correction " + this + " is not supported");
		}
		
		return results;
	}
	
	public static List<Boolean> selectSignificant(List<Double> pValues, List<Double> sigValues, MHC correctionType, double alpha) {
		List<Boolean> result = new LinkedList<Boolean>();
		switch (correctionType) {
//		case BENJAMINI_HOCHBERG:
//			int m = sigValues.size();
//
//			// set all results to false
//			for (int i = 0; i < m; ++i) {
//				result.add(false);
//			}
//			
//			double [] sortedPValues = new double[m];
//			List<Pair<Integer, Double>> sortedPValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
//			for (int i = 0; i < m; ++i) {
//				sortedPValuesIndex.add(new Pair<Integer, Double>(i, pValues.get(i)));
//			}
//			Collections.sort(sortedPValuesIndex);
//			int k = 0;
//			for (int i = 0; i < m; ++i) {
//				if (sigValues.get(sortedPValuesIndex.get(i).getKey()) < alpha) {
//					k = i + 1;
//				}
//			}
//			for (int i = 0; i < k; ++i) {
//				result.set(sortedPValuesIndex.get(i).getKey(), true);
//			}
			

//			double[] sortedSigValues = new double[m];
//			List<Pair<Integer, Double>> sortedSigValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
//			for (int i = 0; i < m; ++i) {
//				sortedSigValuesIndex.add(new Pair<Integer, Double>(i, sigValues.get(i)));
//			}
//			Collections.sort(sortedSigValuesIndex);
//			for (int i = 0; i < m; ++i) {
//				sortedSigValues[i] = sortedSigValuesIndex.get(i).getValue();
//			}
//
//			int k = 0;
//			for (int i = 0; i < m; ++i) {
//				if (sortedSigValues[i] < alpha) {
//					k = i + 1;
//				}
//			}
//			for (int i = 0; i < k; ++i) {
//				result.set(sortedSigValuesIndex.get(i).getKey(), true);
//			}
//			break;
//		case BONFERRONI:
//			alpha /= sigValues.size();
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
//		for (int i = 0; i < 96; ++i) {
//			System.out.print("" + /* lambda[i] + ":" + */pi0[i] + " ");
//		}
//		System.out.println("");
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
		
		// check if pi0_1 falls outside the acceptable range of (0,1)
		// in this case, the FDR storey assumption that null hypotheses have uniformly distributed p values is violated
		if (pi0_1 > 1.0) {
			System.err.println("Estimate of pi0 at lambda=1 is greater than 1 - data may be inappropriate for Storey " +
					"correction. Default value of pi0=1 used.");
			pi0_1 = 1.0;
		} else if (pi0_1 * m < 1.0) {
			System.err.println("Estimate of pi0 at lambda=1 is less than 1/m - data may be inappropriate for Storey " +
					"correction. Default value of pi0=1/m used.");
			pi0_1 = 1.0/m;
		}
//		System.out.println("Estimate of pi0_1: " + pi0_1);
//		System.out.println("Evaluation of smoothing spline over 0:0.01:1");
//		for (int i = 0; i <= 100; ++i) {
//			System.out.print("" + fit.evaluate((double) i / 100) + " ");
//		}
//		System.out.println();

		double[] sortedQValues = new double[m];
		for (int i = 0; i < m; ++i) {
			sortedQValues[i] = pi0_1 * sortedPValues[m - 1];
		}

		for (int i = m - 2; i >= 0; --i) {
			double a = sortedQValues[i + 1];
			double b = pi0_1 * m * sortedPValues[i] / (i + 1);
			sortedQValues[i] = a < b ? a : b;
		}
//		System.out.println("Sorted q values");
//		System.out.println(Arrays.toString(sortedQValues));
		
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
		System.out.println("sorted p " + Arrays.toString(sortedPValues));

		double[] sortedQValues = new double[m];
		sortedQValues[m - 1] = sortedPValues[m - 1];
		for (int i = m - 2; i >= 0; --i) {
			double prevQValue = sortedQValues[i + 1];
			double thisPValue = sortedPValues[i];
			double a = m * thisPValue / (i + 1);
			double result = a < prevQValue ? a : prevQValue;
			sortedQValues[i] = result;
		}
		System.out.println("sorted q " + Arrays.toString(sortedQValues));

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
		System.out.println("q " + qValues);
		return qValues;
	}

	public static List<Double> bonferroni(List<Double> pValues) {
		List<Double> result = new LinkedList<Double>();
		for (Double pValue : pValues) {
			result.add(pValue * pValues.size());
		}
		return result;
	}
}
