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
import weka.filters.unsupervised.attribute.NominalToString;
import weka.filters.unsupervised.attribute.StringToNominal;

import java.io.*;
import multinet.*;
import weka.classifiers.Evaluation;

import java.text.DecimalFormat;
import java.util.*;

import weka.classifiers.bayes.net.MarginCalculator;
import weka.classifiers.bayes.net.ParentSet;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.*;
import weka.classifiers.bayes.net.estimate.*;
import weka.classifiers.bayes.net.search.local.*;

public class MultinetCrossVal_JH {
	public static final String fileName = "test";
	public static final Random rand = new Random(1);
	public static final double bagProp = 0.80;
	public static final int iterNum = 1;
	public static final double threshVal = 0.005;

	public static void main(String args[]) throws Exception {
		go(fileName);
	}

	// change to either build a simple Bayesian network or Bayesian multinet
	public static void go(String name) throws Exception {
		/*
		 * run buildBayes to build simple Bayesian classifier run buildMultinet
		 * to build Multinet classifier
		 */
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

		data = spliceControl(data);

		int numClass = data.numClasses();

		HashMap<String, DirEdge> hms[] = new HashMap[numClass];
		for (int iClass = 0; iClass < numClass; iClass++) {
			hms[iClass] = new HashMap<String, DirEdge>();
		}

		HashMap<String, Integer> freq = new HashMap<String, Integer>();

		for (int it = 1; it <= iterNum; it++) {
			System.out.println("iteration #" + it);

			BayesMultiNet_filtered tbayes = new BayesMultiNet_filtered();
			tbayes.buildClassifier(getSubInstances(data, (int)Math.ceil(data.numInstances() * bagProp)));

			{
				Instances filtered = tbayes.m_Instances;
				int n = filtered.numAttributes();
				for (int i = 1; i < n; i++) {
					inc(freq, filtered.attribute(i).name());
				}
			}

			for (int iClass = 0; iClass < numClass; iClass++) {
//				System.out.println("class " + data.classAttribute().value(iClass));

				BayesNet cur = tbayes.m_Structures[iClass];
				int n = cur.getNrOfNodes();

				for (int i = 0; i < n; i++) {
					if (cur.getNodeName(i).equals("class")) continue;

					ParentSet ps = cur.getParentSet(i);
					int m = ps.getNrOfParents();

					if (m == 0) continue;
					
					int binNum = ps.getCardinalityOfParents();
					ArrayList<Double> probs = new ArrayList<Double>();
					for (int j = 0; j < binNum; j++) {
						for (int k = 0; k < binNum; k++) {
							probs.add(cur.getProbability(i, j, k));
						}
					}
					double influence = Util.variance(probs);
					if (influence < 1e-10) {
						continue;
					}
					
					for (int j = 0; j < m; j++) {
						int p = ps.getParent(j);
						if (cur.getNodeName(p).equals("class")) continue;

						String sa = cur.getNodeName(p);
						String sb = cur.getNodeName(i);
						String edge;
						if (sa.compareTo(sb) < 0) {
							edge = sa + " " + sb;
							inca(hms[iClass], edge, influence);
						} else {
							edge = sb + " " + sa;
							incb(hms[iClass], edge, influence);
						}
					}
				}
			}
		}

		System.out.println("***Writing individual files***");

		for (int iClass = 0; iClass < numClass; iClass++) {
			HashMap<String, DirEdge> curhm = hms[iClass];
			TreeMap<DirEdge, ArrayList<String> > sorted = new TreeMap<DirEdge, ArrayList<String> >();
			for (Map.Entry<String, DirEdge> me : curhm.entrySet()) {
				String a = me.getKey();
				DirEdge b = me.getValue();
				if (sorted.get(b) == null) {
					sorted.put(b, new ArrayList<String>());
				}
				sorted.get(b).add(a);
			}

			FileWriter output = new FileWriter(name + "_" + data.classAttribute().value(iClass) + ".txt");
			for (Map.Entry<DirEdge, ArrayList<String> > se : sorted.entrySet()) {
				if (se.getKey().sum() < threshVal) continue;
				for (String s : se.getValue()) {
					if (se.getKey().prop() >= 0.5) {
						output.write(s + " " + se.getKey());
						output.write("\n");
					} else {
						String[] rearr = s.split("[ ]");
						output.write(rearr[1] + " " + rearr[0] + " " + se.getKey().swap());
						output.write("\n");
					}
				}
			}
			output.write("\n");
			output.close();
		}

		System.out.println("***Generating statistics***");

		/* create Bayesian network classifier */
		BayesMultiNet_filtered bayes = new BayesMultiNet_filtered();
		bayes.buildClassifier(data);

		FileWriter totOutput = new FileWriter(name + "_output.txt");

		totOutput.write("Frequencies:\n");
		TreeMap<Integer, ArrayList<String> > sortedfreq = new TreeMap<Integer, ArrayList<String> >();
		for (Map.Entry<String, Integer> e : freq.entrySet()) {
			int c = e.getValue();
			if (sortedfreq.get(c) == null) {
				sortedfreq.put(c, new ArrayList<String>());
			}
			sortedfreq.get(c).add(e.getKey());
		}
		for (Integer c : sortedfreq.descendingKeySet()) {
			for (String s : sortedfreq.get(c)) {
				totOutput.write(s + " " + c);
				totOutput.write("\n");
			}
		}

		totOutput.write("\nMultinet:");
		totOutput.write(bayes.toString());
		totOutput.write("\n");

		/* cross-validation of Bayesian network */
		BayesMultiNet_filtered bayes2 = new BayesMultiNet_filtered();
		Evaluation evaluation = new Evaluation(data);
		evaluation.crossValidateModel(bayes2, data, 10, rand);
		totOutput.write(evaluation.toSummaryString());
		totOutput.write("Weighted area under ROC: ");
		totOutput.write(Double.toString(evaluation.weightedAreaUnderROC()));
		totOutput.write("\n");
		System.out.println("Weighted area under ROC: " + evaluation.weightedAreaUnderROC());

		totOutput.write("Confusion Matrix: \n");
		double[][] mat = evaluation.confusionMatrix();
		for (double[] row : mat) {
			for (double val : row) {
				totOutput.write(Double.toString(val));
				totOutput.write(" ");
			}
			totOutput.write("\n");
		}

		totOutput.close();
	}

	public static Instances spliceControl(Instances data) throws Exception {
		NominalToString fwd = new NominalToString();
		fwd.setAttributeIndexes("1");
		fwd.setInputFormat(data);
		data = Filter.useFilter(data, fwd);

		int n = data.numInstances();
		String curclass = "";
		for (int i = n - 1; i >= 0; i--) {
			Instance cur = data.instance(i);
			String cc = cur.toString(0);
			if (cc.equals("Control")) {
				cur.setClassValue(curclass);
			} else {
				curclass = "Control_" + cc;
			}
		}

		StringToNominal bck = new StringToNominal();
		bck.setAttributeRange("1");
		bck.setInputFormat(data);
		data = Filter.useFilter(data, bck);

		System.gc();
		return data;
	}

	public static double diff(double[] a, double[] b) {
		double dist = 0;
		for (int i = 0; i < a.length; i++) {
			double t = a[i] - b[i];
			dist += t * t;
		}
		return dist * a.length;
	}

	public static void inc(HashMap<String, Integer> hm, String s) {
		if (hm.get(s) == null) {
			hm.put(s, 1);
		} else {
			hm.put(s, hm.get(s) + 1);
		}
	}

	public static void inca(HashMap<String, DirEdge> hm, String s, double val) {
		if (hm.get(s) == null) {
			hm.put(s, new DirEdge());
		}
		hm.put(s, hm.get(s).adda(val));
	}
	
	public static void incb(HashMap<String, DirEdge> hm, String s, double val) {
		if (hm.get(s) == null) {
			hm.put(s, new DirEdge());
		}
		hm.put(s, hm.get(s).addb(val));
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
