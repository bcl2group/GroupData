/*
 * Author: Johnny Ho
 * Date: 7/16/2012
 * 
 * Creates a multinet using data merged from experiments
 * To run this with NetBeans move all the text files from this folder to the folder
 *      with the build.xml file.
 * 
 */
package JH;

import weka.core.Instances;
import weka.core.SelectedTag;
import weka.core.SerializedObject;
import weka.classifiers.bayes.*;
import weka.classifiers.*;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Discretize;
import java.io.*;
import multinet.*;
import weka.classifiers.Evaluation;
import java.util.*;

import weka.classifiers.bayes.net.BIFReader;
import weka.classifiers.bayes.net.EditableBayesNet;
import weka.classifiers.bayes.net.MarginCalculator;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.ParentSet;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.*;

public class Multinet_JH {
	public static final String fileName = "all_10percent";
	public static final Random rand = new Random(1);
	public static final int binNum = 50;
	public static final int iterNum = 10;
	public static final int threshNum = 2;
	public static final double bagProp = 0.7;

	public static void main(String args[]) throws Exception {
		go(fileName);
	}

	// change to either build a simple Bayesian network or Bayesian multinet
	public static void go(String name) throws Exception {
		/*
		 * run buildBayes to build simple Bayesian classifier run buildMultinet
		 * to build Multinet classifier
		 */

		rand.setSeed(1);

		System.out.println("starting " + name);
		buildBayes(name);

		System.out.println("done");
	}

	/* create simple Bayesian network (TAN) */
	public static void buildBayes(String name) throws Exception {

		/* read in ARFF */
		BufferedReader reader = new BufferedReader(new FileReader(name + ".txt"));
		Instances data = new Instances(reader);
		reader.close();
		data.setClassIndex(0);

		// discretize data
		Discretize dis = new Discretize();
		dis.setBins(binNum);
		dis.setInputFormat(data);
		Instances newData = Filter.useFilter(data, dis);
		newData.setClassIndex(0);

		int numClass = newData.numClasses();

		HashMap<String, Integer> hms[] = new HashMap[numClass];
		for (int iClass = 0; iClass < numClass; iClass++) {
			hms[iClass] = new HashMap<String, Integer>();
		}

		for (int it = 1; it <= iterNum; it++) {
			System.out.println("iteration #" + it);

			BayesMultiNet tbayes = new BayesMultiNet();
			tbayes.buildClassifier(getSubInstances(newData, (int)Math.ceil(newData.numInstances() * bagProp)));

			for (int iClass = 0; iClass < numClass; iClass++) {
				System.out.println("class " + newData.classAttribute().value(iClass));
				
				BayesNet cur = tbayes.m_Structures[iClass];
				int n = cur.getNrOfNodes();
				for (int i = 0; i < n; i++) {
					if (cur.getNodeName(i).equals("class")) continue;

					ParentSet ps = cur.getParentSet(i);
					int m = ps.getNrOfParents();

					if (m == 0) continue;


					// limit edges to those that have a positive relationship

					double corr = 0;
					for (int j = 0; j < binNum; j++) {
						if (j * 2 + 1 == binNum) continue;
						for (int k = 0; k < binNum; k++) {
							if (k * 2 + 1 == binNum) continue;
							double prob = cur.getProbability(i, j, k);
							if (((j * 2 + 1 < binNum) ^ (k * 2 + 1 < binNum)) == false) {
								corr += prob;
							} else {
								corr -= prob;
							}
						}
					}

					if (corr < 0) continue;

					for (int j = 0; j < m; j++) {
						int p = ps.getParent(j);
						if (cur.getNodeName(p).equals("class")) continue;

						String sa = cur.getNodeName(i);
						String sb = cur.getNodeName(p);
						String edge;
						if (sa.compareTo(sb) < 0) {
							edge = sa + " " + sb;
						} else {
							edge = sb + " " + sa;
						}
						inc(hms[iClass], edge);
					}
				}
			}
		}
		
		System.out.println("***Writing individual files***");

		for (int iClass = 0; iClass < numClass; iClass++) {
			HashMap<String, Integer> curhm = hms[iClass];
			TreeMap<Integer, ArrayList<String> > sorted = new TreeMap<Integer, ArrayList<String> >();
			for (Map.Entry<String, Integer> me : curhm.entrySet()) {
				String a = me.getKey();
				int b = me.getValue();
				if (sorted.get(b) == null) {
					sorted.put(b, new ArrayList<String>());
				}
				sorted.get(b).add(a);
			}

			FileWriter output = new FileWriter(name + "_" + newData.classAttribute().value(iClass) + ".txt");
			for (Map.Entry<Integer, ArrayList<String> > se : sorted.entrySet()) {
				if (se.getKey() < threshNum) continue;
				for (String s : se.getValue()) {
					output.write(s + " " + se.getKey());
					output.write("\n");
				}
			}
			output.write("\n");
			output.close();
		}
		
		System.out.println("***Generating statistics***");

		/* create Bayesian network classifier */
		BayesMultiNet bayes = new BayesMultiNet();
		bayes.buildClassifier(newData);

		FileWriter netOutput = new FileWriter(name + "_output.txt");

		netOutput.write("Multinet:");
		netOutput.write(bayes.toString());
		netOutput.write("\n");

		/* cross-validation of Bayesian network */
		BayesMultiNet bayes2 = new BayesMultiNet();
		Evaluation evaluation = new Evaluation(newData);
		evaluation.crossValidateModel(bayes2, newData, 10, rand);
		netOutput.write(evaluation.toSummaryString());
		netOutput.write("Weighted area under ROC: ");
		netOutput.write(Double.toString(evaluation.weightedAreaUnderROC()));
		netOutput.write("\n");

		netOutput.write("Confusion Matrix: \n");
		double[][] mat = evaluation.confusionMatrix();
		for (double[] row : mat) {
			for (double val : row) {
				netOutput.write(Double.toString(val));
				netOutput.write(" ");
			}
			netOutput.write("\n");
		}

		netOutput.close();
	}
	
	public static double diff(double[] a, double[] b) {
		double dist = 0;
		for (int i = 0; i < a.length; i++) {
			double t = a[i] - b[i];
			dist += t * t;
		}
		return dist;
	}

	public static void inc(HashMap<String, Integer> hm, String s) {
		if (hm.get(s) == null) {
			hm.put(s, 1);
		} else {
			hm.put(s, hm.get(s) + 1);
		}
	}

	public static Instances getSubInstances(Instances v, int m) {
		int n = v.numInstances();
		Instances t = new Instances(v);
		while (n > m) {
			t.delete(rand.nextInt(n));
			n--;
		}
		return t;
	}
}

