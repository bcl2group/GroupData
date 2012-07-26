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

import weka.core.Instance;
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

import weka.classifiers.bayes.net.MarginCalculator;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.*;
import weka.classifiers.bayes.net.estimate.*;
import weka.classifiers.bayes.net.search.local.*;

public class MultinetProp_JH {
	public static final String fileName = "all_100percent";
	public static final Random rand = new Random(1);
	public static final double bagProp = 0.7;
	public static final int binNum = 20;
	public static final int iterNum = 15;
	public static final double threshVal = 1.0;

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

		HashMap<String, Double> hms[] = new HashMap[numClass];
		for (int iClass = 0; iClass < numClass; iClass++) {
			hms[iClass] = new HashMap<String, Double>();
		}

		for (int it = 1; it <= iterNum; it++) {
			System.out.println("iteration #" + it);

			BayesMultiNet tbayes = new BayesMultiNet();
			tbayes.buildClassifier(getSubInstances(newData, (int)Math.ceil(newData.numInstances() * bagProp)));

			for (int iClass = 0; iClass < numClass; iClass++) {
				System.out.println("class " + newData.classAttribute().value(iClass));
				
				BayesNet cur = tbayes.m_Structures[iClass];
				int n = cur.getNrOfNodes();
				MarginCalculator calc = new MarginCalculator();
				calc.calcMargins(cur);
				
				double[][] oMargins = new double[n][];
				for (int i = 0; i < n; i++) {
					if (cur.getNodeName(i).equals("class")) continue;
					oMargins[i] = calc.getMargin(i).clone();
				}
				
				for (int src = 0; src < n; src++) {
					if (cur.getNodeName(src).equals("class")) continue;
					
					HashSet<Integer> found = new HashSet<Integer>();
					for (int iBin = 0; iBin < binNum; iBin++) {
						SerializedObject so = new SerializedObject(calc);
						MarginCalculator tmp = (MarginCalculator)so.getObject();
						tmp.setEvidence(src, iBin);
						for (int i = 0; i < n; i++) {
							if (cur.getNodeName(i).equals("class")) continue;
							if (i == src) continue;
							double p = diff(tmp.getMargin(i), oMargins[i]);
							String a = cur.getNodeName(src);
							String b = cur.getNodeName(i);
							String edge;
							if (a.compareTo(b) < 0) {
								edge = a + " " + b;
							} else {
								edge = b + " " + a;
							}
							inc(hms[iClass], edge, p);
						}
					}
				}
			}
		}
		
		System.out.println("***Writing individual files***");

		for (int iClass = 0; iClass < numClass; iClass++) {
			HashMap<String, Double> curhm = hms[iClass];
			TreeMap<Double, ArrayList<String> > sorted = new TreeMap<Double, ArrayList<String> >();
			for (Map.Entry<String, Double> me : curhm.entrySet()) {
				String a = me.getKey();
				double b = me.getValue();
				if (sorted.get(b) == null) {
					sorted.put(b, new ArrayList<String>());
				}
				sorted.get(b).add(a);
			}

			FileWriter output = new FileWriter(name + "_" + newData.classAttribute().value(iClass) + ".txt");
			for (Map.Entry<Double, ArrayList<String> > se : sorted.entrySet()) {
				if (se.getKey() < threshVal) continue;
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
		return dist * a.length;
	}

	public static void inc(HashMap<String, Double> hm, String s, double val) {
		if (hm.get(s) == null) {
			hm.put(s, val);
		} else {
			hm.put(s, hm.get(s) + val);
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
