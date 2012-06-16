package main;

import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.TreeSet;

import utilities.Utilities;
import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.TAN;
import weka.core.Instance;
import weka.core.Instances;

public class ComputePredictivePower {

	private static Map<Integer, ArrayList<double[]>> sampleAUROCs = new HashMap<Integer, ArrayList<double[]>>();

	private static Instances trainData, testData, trainFullData, testFullData;
	private static Instances[] rTrainData, rTestData, rTrainFullData, rTestFullData;

	public static void setInstances(Instances trainData, Instances testData, Instances trainFullData,
			Instances testFullData, int repetitions) {
		ComputePredictivePower.trainData = trainData;
		ComputePredictivePower.testData = testData;
		ComputePredictivePower.trainFullData = trainFullData;
		ComputePredictivePower.testFullData = testFullData;

		if (repetitions > 0) {
			System.out.println("- Merging data sets");
			int numTest = testData.numInstances();
			int numTrain = trainData.numInstances();
			int numTotal = numTest + numTrain;
			// System.out.println("" + numTest + ", " + numTotal);

			Instances merged = new Instances(trainData);
			Instances mergedFull = new Instances(trainFullData);
			// System.out.println(merged.numInstances());

			Enumeration testEnum = testData.enumerateInstances();
			while (testEnum.hasMoreElements()) {
				merged.add((Instance) testEnum.nextElement());
			}

			Enumeration testFullEnum = testFullData.enumerateInstances();
			while (testFullEnum.hasMoreElements()) {
				mergedFull.add((Instance) testFullEnum.nextElement());
			}

			rTrainData = new Instances[repetitions];
			rTestData = new Instances[repetitions];
			rTrainFullData = new Instances[repetitions];
			rTestFullData = new Instances[repetitions];

			for (int i = 0; i < repetitions; ++i) {
				if (i == 0) {
					// for first repetition, use the given split of test and training data
					rTrainData[i] = trainData;
					rTestData[i] = testData;
					rTrainFullData[i] = trainFullData;
					rTestFullData[i] = testFullData;
				} else {
					// choose random subset of merged instances to be test instances, with the same number as the
					// given test instances
					int[] testIndices = Utilities.randomSubset(numTotal, numTest, new Random((/* seed + */i) * (i + 1)));
					Arrays.sort(testIndices);

					rTrainData[i] = new Instances(trainData, numTrain);
					rTestData[i] = new Instances(testData, numTest);
					rTrainFullData[i] = new Instances(trainFullData, numTrain);
					rTestFullData[i] = new Instances(testFullData, numTest);

					int nextTestIndex = 0;
					for (int index = 0; index < numTotal; ++index) {
						if (nextTestIndex >= testIndices.length || index != testIndices[nextTestIndex]) {
							rTrainData[i].add(merged.instance(index));
							rTrainFullData[i].add(mergedFull.instance(index));
						} else {
							rTestData[i].add(merged.instance(index));
							rTestFullData[i].add(mergedFull.instance(index));
							++nextTestIndex;
						}
					}
				}

			}
		} else {
			rTrainData = new Instances[] { trainData };
			rTestData = new Instances[] { testData };
			rTrainFullData = new Instances[] { trainFullData };
			rTestFullData = new Instances[] { testFullData };
		}
	}

	public static Results run(Map<Concept, TreeSet<SNP>> conceptToSNP, int lowerThreshold, int upperThreshold,
			int numIterations, int numRepetitions) throws Exception {
		List<Concept> concepts = new LinkedList<Concept>();
		for (Concept concept : conceptToSNP.keySet()) {
			if (concept.numSNPs() >= lowerThreshold && concept.numSNPs() <= upperThreshold) {
				concepts.add(concept);
			}
		}
		System.out.println("Testing " + concepts.size() + " concepts");

		precomputeSamples(concepts, numRepetitions, numIterations);

		if (numRepetitions <= 0) {
			numRepetitions = 1;
		}

		Results results = new Results(numRepetitions);

		for (int repNum = 0; repNum < numRepetitions; ++repNum) {
			for (Concept concept : concepts) {
				double auroc = 0.0;
				TreeSet<SNP> snps = conceptToSNP.get(concept);
				// compute AUROC for concept with the data for this repetition
				List<Integer> snpIndicesList = ProcessInputForConcept.convertSNPToIndices(trainData, snps);
				int[] snpIndices = new int[snpIndicesList.size()];
				int currentIndex = 0;
				for (Integer snpIndex : snpIndicesList) {
					snpIndices[currentIndex++] = snpIndex;
				}

				Instances cTrainData = generateInstances(rTrainData[repNum], concept, snpIndices);
				Instances cTestData = generateInstances(rTestData[repNum], concept, snpIndices);

				auroc = findAUROC(cTrainData, cTestData);

				// compare AUROC with samples to find predictive power
//				System.out.println("" + concept + " (" + concept.numSNPs() + " SNPS)");
				double pValue = (double) Utilities.numExceeding(sampleAUROCs.get(concept.numSNPs()).get(repNum), auroc,
						true) / numIterations;
//				System.out.println("\tAUROC: " + auroc + ", p-value: " + pValue);
				results.addEntry(repNum, concept, auroc, pValue);
			}
		}

		return results;
	}

	private static void precomputeSamples(Collection<Concept> concepts, int numRepetitions,
			int numIterations) throws Exception {
		for (Concept concept : concepts) {
			int numSNPs = concept.numSNPs();
			if (!sampleAUROCs.containsKey(numSNPs)) {
				ArrayList<double[]> samples = new ArrayList<double[]>(numRepetitions);
				System.out.println("Precomputing samples for " + numSNPs + " SNPs");
				int upper = trainFullData.numAttributes() - 3;
				long tt1 = System.currentTimeMillis();
				long weka = 0;
				for (long repNum = 0; repNum < numRepetitions; ++repNum) {
					double[] aurocs = new double[numIterations];
					for (long iterNum = 0; iterNum < numIterations; ++iterNum) {
						Random random = new Random(numSNPs * repNum * numIterations + iterNum);
						int[] randomIndices = Utilities.randomSubset(upper, numSNPs, random);
						Instances cTrainFullData = generateInstances(trainFullData, concept, randomIndices);
						Instances cTestFullData = generateInstances(testFullData, concept, randomIndices);
						long t = System.currentTimeMillis();
						aurocs[(int) iterNum] = findAUROC(cTrainFullData, cTestFullData);
						weka += System.currentTimeMillis() - t;
					}
					Arrays.sort(aurocs);
					samples.add(aurocs);
				}
				sampleAUROCs.put(numSNPs, samples);
				System.out.println("Total elapsed time " + (System.currentTimeMillis() - tt1));
				System.out.println("Weka time " + weka);
			}
		}
	}

	private static Instances generateInstances(Instances data, Concept concept, int[] snpIndices) throws Exception {
		int numAttributes = data.numAttributes();

		int[] saveIndices = new int[3];
		for (int i = 0; i < saveIndices.length; i++) {
			saveIndices[i] = numAttributes - saveIndices.length + i;
		}
		Instances instances = ProcessInputForConcept.run(data, snpIndices, true, saveIndices);
		// String fileOutputName = prefix + concept + "_" + snps.size() + "_SNPS.arff" + postfix;
		//
		// ArffSaver saver = new ArffSaver();
		// saver.setInstances(instances);
		// saver.setFile(new File(fileOutputName));
		// saver.writeBatch();

		// return fileOutputName;

		return instances;
	}

	private static double findAUROC(Instances trainData, Instances testData) throws Exception {
		Classifier classifier = new BayesNet();
		TAN xTAN = new TAN();
		// xTAN.setScoreType(new SelectedTag(3, xTAN.getScoreType().getTags())); // NOT REALLY EVEN SURE
		SimpleEstimator xSE = new SimpleEstimator();
		xSE.setAlpha(5);
		((BayesNet) classifier).setSearchAlgorithm(xTAN);
		((BayesNet) classifier).setEstimator(xSE);

		// Evaluation evalCV = new Evaluation(trainData);
		Evaluation evalValid = new Evaluation(trainData);

		// Classifier cpyCls_cv = Classifier.makeCopy(classifier);
		Classifier cpyCls_valid = Classifier.makeCopy(classifier);

		// CV overfit set
		// evalCV.crossValidateModel(cpyCls_cv, trainData, 10, new Random(seed));

		cpyCls_valid.buildClassifier(trainData);
		evalValid.evaluateModel(cpyCls_valid, testData);

		return evalValid.weightedAreaUnderROC();
	}

	public static void main(String [] args) throws Exception {
		Concept concept = new Concept("");
		concept.addSNP(new SNP("1"));
		concept.addSNP(new SNP("2"));
		List<Concept> concepts = new ArrayList<Concept>();
		concepts.add(concept);
		
		Properties props = new Properties();
		FileInputStream in = new FileInputStream(args[0]);
		props.load(in);
		in.close();
		String trainFile = props.getProperty("train");
		String testFile = props.getProperty("test");
		String trainFullFile = props.getProperty("trainFull");
		String testFullFile = props.getProperty("testFull");
		Instances train = null, test = null, trainFull = null, testFull = null;
		train = ExtractInstances.run(trainFile);
		test = ExtractInstances.run(testFile);
		trainFull = ExtractInstances.run(trainFullFile);
		testFull = ExtractInstances.run(testFullFile);
		setInstances(train, test, trainFull, testFull, 1);
		
		precomputeSamples(concepts, 1, 1000);
		BufferedWriter output = new BufferedWriter(new FileWriter("aurocs.txt"));
		for (double d : sampleAUROCs.get(2).get(0)){
			output.write("" + d + " ");
		}
		output.close();
	}
}
