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
import weka.classifiers.bayes.net.ParentSet;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.K2;
import weka.classifiers.bayes.net.search.local.TabuSearch;
import weka.classifiers.bayes.net.search.local.LocalScoreSearchAlgorithm;
import weka.classifiers.bayes.net.search.local.Scoreable;
import weka.classifiers.bayes.net.search.local.TAN;

public class Singlenet_JH {
	public static final String fileListName = "_list.txt";
	public static final Random rand = new Random(1);
	public static final int binNum = 2;
	public static final double jackknifeProp = 0.8;

	public static void main(String args[]) throws Exception {
		BufferedReader reader = new BufferedReader(new FileReader(fileListName));
		String s;
		while (true) {
			s = reader.readLine();
			if (s == null) break;
			s = s.trim();
			if (s.isEmpty()) break;
			go(s);
		}
	}

	// change to either build a simple Bayesian network or Bayesian multinet
	public static void go(String name) throws Exception {
		/*
		 * run buildBayes to build simple Bayesian classifier run buildMultinet
		 * to build Multinet classifier
		 */

		rand.setSeed(1);

		System.out.println("starting " + name);
		String filename = name + ".txt";
		String filenameOut = name + "_output.txt";
		String filenameNet = name + "_net.xml";

		buildBayes(filename, filenameOut, filenameNet);

		System.out.println("done");
	}

	/* create simple Bayesian network (TAN) */
	public static void buildBayes(String filename_singlenet,
			String output_filename, String output_filename_net) throws Exception {

		/* read in ARFF */
		BufferedReader reader = new BufferedReader(new FileReader(
				filename_singlenet));
		Instances data = new Instances(reader);
		reader.close();
		data.setClassIndex(0);

		// discretize data
		Discretize dis = new Discretize();
		dis.setBins(binNum);
		dis.setInputFormat(data);
		Instances newData = Filter.useFilter(data, dis);
		newData.setClassIndex(0);

		/* create Bayesian network classifier */
		SimpleEstimator est = new SimpleEstimator();
		est.setAlpha(0.5);
		BayesNet bayes = new BayesNet();
		K2 search = new K2();
		search.setMaxNrOfParents(2);
		//		search.setRuns(500);
		//		search.setUseArcReversal(true);
		//		search.setTabuList(10);
		search.setScoreType(new SelectedTag(Scoreable.BAYES, LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));

		bayes.setEstimator(est);
		bayes.setSearchAlgorithm(search);
		bayes.buildClassifier(newData);

		//		FileWriter outputnet = new FileWriter(output_filename_net);
		//		outputnet.write(bayes.toXMLBIF03());
		//		outputnet.close();

		HashMap<String, Integer> hm = new HashMap<String, Integer>();

		for (int it = 0; it < 100; it++) {
			System.out.println(it);

			BayesNet tbayes = new BayesNet();
			tbayes.setEstimator(est);
			tbayes.setSearchAlgorithm(search);
			tbayes.buildClassifier(getSubInstances(newData, (int)Math.ceil(newData.numInstances() * jackknifeProp)));

			int n = tbayes.getNrOfNodes();
			for (int i = 0; i < n; i++) {
				if (tbayes.getNodeName(i).equals("class")) continue;

				ParentSet ps = tbayes.getParentSet(i);
				if (ps.getNrOfParents() < 2) continue;

				// examine probability tables
				// look for strong positive correlation between parent and child
				int card = 2 * binNum;
				double corr = 0;
				for (int j = 0; j < card; j++) {
					int iclass = j / binNum;
					int ibin = j % binNum;
					if (ibin * 2 + 1 == binNum) continue;
					for (int k = 0; k < binNum; k++) {
						boolean diff = (iclass == 1) ^ (ibin * 2 + 1 > binNum) ^ (k * 2 + 1 > binNum);
						double prob = tbayes.getProbability(i, j, k);
						if (diff) {
							corr += prob;
						} else {
							corr -= prob;
						}
					}
				}
				corr /= card;
				if (corr < 0.2) continue;

				int m = ps.getNrOfParents();
				for (int j = 0; j < m; j++) {
					int p = ps.getParent(j);
					if (tbayes.getNodeName(p).equals("class")) continue;

					String sa = tbayes.getNodeName(i);
					String sb = tbayes.getNodeName(p);
					String edge;
					edge = sa + " " + sb;
					inc(hm, edge);
				}
			}
		}

		TreeMap<Integer, ArrayList<String> > sorted = new TreeMap<Integer, ArrayList<String> >();
		for (Map.Entry<String, Integer> me : hm.entrySet()) {
			String a = me.getKey();
			int b = me.getValue();
			if (sorted.get(b) == null) {
				sorted.put(b, new ArrayList<String>());
			}
			sorted.get(b).add(a);
		}

		FileWriter output = new FileWriter(output_filename);
		for (Map.Entry<Integer, ArrayList<String> > se : sorted.entrySet()) {
			if (se.getKey() < 5) continue;
			for (String s : se.getValue()) {
				output.write(s + " " + se.getKey());
				output.write("\n");
			}
		}
		output.write("\n");


		// newData.setClassIndex(0);
		output.write(bayes.toString());
		output.write("\n");

		/* cross-validation of Bayesian network */
		BayesNet bayes2 = new BayesNet();
		bayes2.setEstimator(est);
		bayes2.setSearchAlgorithm(search);
		Evaluation evaluation = new Evaluation(newData);

		evaluation.crossValidateModel(bayes2, newData, 10, rand);
		output.write(evaluation.toSummaryString());
		output.write("\n");
		output.write("Weighted area under ROC: ");
		output.write(Double.toString(evaluation.weightedAreaUnderROC()));
		output.write("\n");

		// compare negative and positive accuracy rates
		output.write("True negative (control): ");
		output.write(Double.toString(1 - evaluation.falsePositiveRate(0)));
		output.write("\n");
		output.write("True positive: ");
		output.write(Double.toString(1 - evaluation.falsePositiveRate(1)));
		output.close();
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

