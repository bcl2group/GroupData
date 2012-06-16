package main2;

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

@Deprecated
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
		System.out.println(minRepetitions);
		input.close();

		
		for (int i = 0; i < minRepetitions; ++i) {
			List<Concept> concepts = new ArrayList<Concept>();
			List<Double> pValueList = new LinkedList<Double>();
			for (Concept concept : pValues.keySet()) {
				concepts.add(concept);
				pValueList.add(pValues.get(concept).get(i));
			}
			System.out.println(pValueList);
			// System.out.println(map);
			for (MHC mhc : MHC.values()) {
				for (double alpha : new double[] { 0.01, 0.05, 0.1, 0.2, 1.0 }) {
					Map<Concept, List<Double>> results = new HashMap<Concept, List<Double>>();
					List<SigValue> list = run(pValueList, mhc, alpha);
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
					String outputFile = "gene_output2/alcohol/revised/" + mhc + "_alpha=" + alpha + "_" + args[1]
							+ ".txt";
					Utilities.writeLineToFile(Entry.header(), outputFile);
					List<Entry> entries = new ArrayList<Entry>();
					for (Concept concept : results.keySet()) {
						entries.add(new Entry(concept, new LinkedList<Double>(), results.get(concept), false));
					}
					Collections.sort(entries);
					for (Entry entry : entries) {
						Utilities.appendLineToFile(entry.toString(), outputFile);
					}
				}
			}
		}
	}

	public static List<SigValue> run(List<Double> pValues, MHC correctionType, double alpha) {
		List<Double> sigValues = correctionType.correct(pValues);

		List<Boolean> sigFlags = MHC.selectSignificant(pValues, sigValues, correctionType, alpha);
		List<SigValue> result = new LinkedList<SigValue>();
		for (int i = 0; i < sigValues.size(); ++i) {
			result.add(new SigValue(sigValues.get(i), sigFlags.get(i)));
		}
		return result;
	}

	// public static List<Boolean> selectSignificant(List<Double> sigValues, MHC correctionType, double alpha) {
	// List<Boolean> result = new LinkedList<Boolean>();
	// switch (correctionType) {
	// case BENJAMINI_HOCHBERG:
	// int m = sigValues.size();
	//
	// // set all results to false
	// for (int i = 0; i < m; ++i) {
	// result.add(false);
	// }
	//
	// double[] sortedSigValues = new double[m];
	// List<Pair<Integer, Double>> sortedSigValuesIndex = new ArrayList<Pair<Integer, Double>>(m);
	// for (int i = 0; i < m; ++i) {
	// sortedSigValuesIndex.add(new Pair<Integer, Double>(i, sigValues.get(i)));
	// }
	// Collections.sort(sortedSigValuesIndex);
	// for (int i = 0; i < m; ++i) {
	// sortedSigValues[i] = sortedSigValuesIndex.get(i).getValue();
	// }
	//
	// int k = 0;
	// for (int i = 0; i < m; ++i) {
	// if (sortedSigValues[i] < alpha) {
	// k = i + 1;
	// }
	// }
	// for (int i = 0; i < k; ++i) {
	// result.set(sortedSigValuesIndex.get(i).getKey(), true);
	// }
	// break;
	// case BONFERRONI:
	// alpha /= sigValues.size();
	// default:
	// for (Double sigValue : sigValues) {
	// if (sigValue < alpha) {
	// result.add(true);
	// } else {
	// result.add(false);
	// }
	// }
	// break;
	// }
	// return result;
	// }
}
