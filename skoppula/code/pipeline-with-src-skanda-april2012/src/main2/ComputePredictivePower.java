package main2;

import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
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

import main.ExtractInstances;

import utilities.NamedSet;
import utilities.Utilities;
import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.NaiveBayes;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.TAN;
import weka.classifiers.evaluation.thresholdcurve;
import weka.core.Instance;
import weka.core.Instances;

public class ComputePredictivePower {

	private Map<Integer, ArrayList<double[]>> sampleAUROCs = new HashMap<Integer, ArrayList<double[]>>();
	
	//train is equal to trainfull, test=testfull=null
	private Instances train, test, trainFull, testFull;
	
	//Since only one *R*epition, these are the only array of size 1.
	private Instances[] rTrainData, rTestData, rTrainFullData, rTestFullData;

	private int repetitions;
	private int iterations;
	private boolean runOnInitialPartition;
	private boolean multithreading;

	// only for SNP data
	private boolean isSNPData;
	private boolean includeEnvVariables;
	private int numEnvVariables;
	private int lowerThreshold;
	private int upperThreshold;

	// identity of classifier to use
	// options: TAN, NaiveBayes
	private String classifierName;
	
	// used in multithreading
	double [] aurocs;

	public ComputePredictivePower(Properties p) throws IOException {
		String trainFullFile = p.getProperty("trainFull");
		String testFullFile = p.getProperty("testFull", null);
		String trainFile = p.getProperty("train", trainFullFile);
		String testFile = p.getProperty("test", testFullFile);

		//Extract instances on trainfull in our case
		train = ExtractInstances.run(trainFile);
		test = ExtractInstances.run(testFile);
		trainFull = ExtractInstances.run(trainFullFile);
		testFull = ExtractInstances.run(testFullFile);

		isSNPData = p.getProperty("isSNPData", "y").equals("y");
		includeEnvVariables = p.getProperty("envVariables", "y").equals("y");
		numEnvVariables = includeEnvVariables ? Integer.parseInt(p.getProperty("numEnvVariables", "2")) : 0;

		repetitions = Integer.parseInt(p.getProperty("repetitions", "1"));
		iterations = Integer.parseInt(p.getProperty("iterations", "1000"));
		runOnInitialPartition = p.getProperty("runOnInitialPartition", "y").equals("y");
		multithreading = !p.getProperty("multithreading", "n").equalsIgnoreCase("n");

		lowerThreshold = Integer.parseInt(p.getProperty("lowerThreshold", "2"));
		upperThreshold = Integer.parseInt(p.getProperty("upperThreshold", "1000"));

		classifierName = p.getProperty("classifier", "TAN");

		generateDataSets();
	}

	private void generateDataSets() {
		System.out.println("- Merging data sets");

		rTrainData = new Instances[repetitions];
		rTestData = new Instances[repetitions];
		rTrainFullData = new Instances[repetitions];
		rTestFullData = new Instances[repetitions];

		//THIS IS OUR CASE!!!! :D
		if (testFull == null) {
			for (int repNum = 0; repNum < repetitions; ++repNum) {
				rTrainData[repNum] = train;
				rTrainFullData[repNum] = trainFull;
			}
			return;
		}

		int numTest = test.numInstances();
		int numTrain = train.numInstances();
		int numTotal = numTest + numTrain;

		Instances merged = new Instances(train);
		Instances mergedFull = new Instances(trainFull);

		// add test instances to model instances
		Enumeration testEnum = test.enumerateInstances();
		while (testEnum.hasMoreElements()) {
			merged.add((Instance) testEnum.nextElement());
		}

		// add full test instances to full instances
		Enumeration testFullEnum = testFull.enumerateInstances();
		while (testFullEnum.hasMoreElements()) {
			mergedFull.add((Instance) testFullEnum.nextElement());
		}

		for (int i = 0; i < repetitions; ++i) {
			if (i == 0 && runOnInitialPartition) {
				// for first repetition, use the given split of test and
				// training data
				rTrainData[i] = train;
				rTestData[i] = test;
				rTrainFullData[i] = trainFull;
				rTestFullData[i] = testFull;
			} else {
				// choose random subset of merged instances to be test
				// instances, with the same number as the
				// given test instances
				int[] testIndices = Utilities.randomSubset(numTotal, numTest, new Random((/* seed + */i) * (i + 1)));
				Arrays.sort(testIndices);

				rTrainData[i] = new Instances(train, numTrain);
				rTestData[i] = new Instances(test, numTest);
				rTrainFullData[i] = new Instances(trainFull, numTrain);
				rTestFullData[i] = new Instances(testFull, numTest);

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
	}

	public Results run(NamedSet<Concept> conceptSet) throws Exception {
		
		//analyze concepts only within lower/upper threshold
		List<Concept> concepts = new LinkedList<Concept>();
		for (Concept concept : conceptSet) {
			if (!isSNPData || (concept.numSNPs() >= lowerThreshold && concept.numSNPs() <= upperThreshold)) {
				concepts.add(concept);
			}
		}

		System.out.println("Testing " + concepts.size() + " concepts");
		Results results = new Results(repetitions);
		
		for (int repNum = 0; repNum < repetitions; ++repNum) {
			int numConcepts = 0;
			for (Concept concept : concepts) {
				//
				if (isSNPData) {
					Collection<SNP> snps = concept.getSNPs();
					// compute AUROC for concept with the data for this repetition
					Collection<String> snpStrs = Utilities.toStrings(snps);
					double auroc = findAUROC(repNum, snpStrs);

					// compare AUROC with samples to find predictive power
					// System.out.println("" + concept + " (" + concept.numSNPs() + " SNPS)");
					precomputeSamples(concept.numSNPs());
					double pValue = (double) Utilities.numExceeding(sampleAUROCs.get(concept.numSNPs()).get(repNum),
							auroc, true) / iterations;
					// System.out.println("\tAUROC: " + auroc + ", p-value: " + pValue);
					results.addEntry(repNum, concept, auroc, pValue);
				} else {
					Collection<Gene> genes = concept.getGenes();
					Collection<String> geneStrs = Utilities.toStrings(genes);

					int numGenes = 0;
					concept.clearGenes();
					for (String geneStr : geneStrs) {
						if (train.attribute(geneStr) != null) {
							concept.addGene(new Gene(geneStr));
							++numGenes;
						}
					}

					// ignore cases where gene data doesn't contain any genes in common with concept
					// System.out.println("" + concept + " (" + concept.numSNPs() + " SNPS)");
					if (numGenes >= lowerThreshold && numGenes <= upperThreshold) {
						++numConcepts;
						// compute AUROC for concept with the data for this repetition
						double auroc = findAUROC(repNum, geneStrs);

						List<Integer> indices = ProcessInputForConcept.convertFeaturesToIndices(train, geneStrs);
						precomputeSamples(numGenes);
						double pValue = (double) Utilities.numExceeding(sampleAUROCs.get(numGenes).get(repNum), auroc,
								true) / iterations;
						// System.out.println("\tAUROC: " + auroc + ", p-value: " + pValue);
						results.addEntry(repNum, concept, auroc, pValue);
					}
				}
			}
			System.out.println(numConcepts + " concepts");
		}

		return results;
	}

	public List<Double> findPValue(Collection<String> features) throws Exception {
		List<Double> results = new ArrayList<Double>();

		for (int repNum = 0; repNum < repetitions; ++repNum) {
			double auroc = findAUROC(repNum, features);
			precomputeSamples(features.size());
			results.add((double) Utilities.numExceeding(sampleAUROCs.get(features.size()).get(repNum), auroc, true)
					/ iterations);
		}

		return results;
	}

	private double findAUROC(int repNum, Collection<String> features) throws Exception {
		List<Integer> snpIndicesList = ProcessInputForConcept.convertFeaturesToIndices(train, features);
		int[] snpIndices = new int[snpIndicesList.size()];
		int currentIndex = 0;
		for (Integer snpIndex : snpIndicesList) {
			snpIndices[currentIndex++] = snpIndex;
		}

		if (snpIndices.length == 0) {
			// no features in the training or testing set - can only randomly
			// guess
			return 0.5;
		}

		Instances cTrainData = generateInstances(rTrainData[repNum], snpIndices);
		Instances cTestData = generateInstances(rTestData[repNum], snpIndices);

		double auroc = findAUROC(cTrainData, cTestData);
		return auroc;
	}

	private void precomputeSamples(int numFeatures) throws Exception {
	
		//numFeatures = number of SNPs in concept
		
		// for (Concept concept : concepts) {
		// int numSNPs = concept.numSNPs();
		if (!sampleAUROCs.containsKey(numFeatures)) {
			ArrayList<double[]> samples = new ArrayList<double[]>(repetitions);
			System.out.println("Precomputing samples for " + numFeatures + " features");
			int upper = trainFull.numAttributes() - 1;
			if (isSNPData /* && includeEnvVariables */) {
				upper = trainFull.numAttributes() - 1 - numEnvVariables;
			}
			long tt1 = System.currentTimeMillis();
			long weka = 0;
			for (long repNum = 0; repNum < repetitions; ++repNum) {
//				double[] aurocs = new double[iterations];
				aurocs = new double[iterations];
				if (multithreading) {
					ThreadGroup threadGroup = new ThreadGroup("tg");
					int firstBound()
					
					for (long iterNum = 0; iterNum < iterations/4; ++iterNum) {
						Thread thread = new Thread(threadGroup, new ComputeThread(this, numFeatures, upper, repNum,
								aurocs, iterNum));
						thread.start();
					}
					
					for (long iterNum = iterations/4; iterNum < iterations/2; ++iterNum) {
						Thread thread = new Thread(threadGroup, new ComputeThread(this, numFeatures, upper, repNum,
								aurocs, iterNum));
						thread.start();
					}
					
					while (threadGroup.activeCount() > 0) {
						Thread.yield();
					}
					threadGroup.destroy();
				} else {
					for (long iterNum = 0; iterNum < iterations; ++iterNum) {
						weka += computeRandomAUROC(numFeatures, upper, repNum/*, aurocs*/, iterNum);
					}
				}
				Arrays.sort(aurocs);
				samples.add(aurocs);
			}
			sampleAUROCs.put(numFeatures, samples);
			System.out.println("Total elapsed time " + (System.currentTimeMillis() - tt1));
			System.out.println("Weka time " + weka);
		}
		// }
	}

	long computeRandomAUROC(int numFeatures, int upper, long repNum,/* double[] aurocs,*/ long iterNum) throws Exception {
//		 System.out.println(iterNum);

		Random random = new Random(numFeatures * repNum * iterations + iterNum);
		int[] randomIndices = Utilities.randomSubset(upper, numFeatures, random);
		Instances cTrainFullData = generateInstances(rTrainFullData[(int) repNum], randomIndices);
		Instances cTestFullData = generateInstances(rTestFullData[(int) repNum], randomIndices);
		long t = System.currentTimeMillis();
		double nextAUROC = findAUROC(cTrainFullData, cTestFullData);
//		System.out.println(nextAUROC);
		aurocs[(int) iterNum] = nextAUROC;
		return System.currentTimeMillis() - t;
	}

	private Instances generateInstances(Instances data, int[] snpIndices) throws Exception {

		if (data == null) {
			return null;
		}

		int numAttributes = data.numAttributes();

		int[] saveIndices = new int[numEnvVariables + 1];
		for (int i = 0; i < saveIndices.length; i++) {
			saveIndices[i] = numAttributes - saveIndices.length + i;
		}

		if (!isSNPData || !includeEnvVariables) {
			saveIndices = new int[] { numAttributes - 1 };
		}

		Instances instances = ProcessInputForConcept.run(data, snpIndices, true, saveIndices);
		// String fileOutputName = prefix + concept + "_" + snps.size() +
		// "_SNPS.arff" + postfix;
		//
		// ArffSaver saver = new ArffSaver();
		// saver.setInstances(instances);
		// saver.setFile(new File(fileOutputName));
		// saver.writeBatch();

		// return fileOutputName;

		return instances;
	}

	private double findAUROC(Instances trainData, Instances testData) throws Exception {
		// Classifier classifier = getClassifier();
		Classifier cpyCls_valid = getClassifier();

		// Evaluation evalCV = new Evaluation(trainData);
		Evaluation evalValid = new Evaluation(trainData);

		// Classifier cpyCls_cv = Classifier.makeCopy(classifier);
		// Classifier cpyCls_valid = Classifier.makeCopy(classifier);

		// CV overfit set
		// evalCV.crossValidateModel(cpyCls_cv, trainData, 10, new
		// Random(seed));

		if (testData != null) {
			cpyCls_valid.buildClassifier(trainData);
			evalValid.evaluateModel(cpyCls_valid, testData);
		} else {
			// ten-fold cross validation
			evalValid.crossValidateModel(cpyCls_valid, trainData, 10, new Random(42));
		}

		return evalValid.weightedAreaUnderROC();
	}

	private Classifier getClassifier() {
		Classifier classifier;
		if (classifierName.equals("TAN")) {
			classifier = new BayesNet();
			TAN xTAN = new TAN();
			// xTAN.setScoreType(new SelectedTag(3, xTAN.getScoreType().getTags()));
			// // NOT REALLY EVEN SURE
			SimpleEstimator xSE = new SimpleEstimator();
			xSE.setAlpha(5);
			((BayesNet) classifier).setSearchAlgorithm(xTAN);
			((BayesNet) classifier).setEstimator(xSE);
			return classifier;
		} else if (classifierName.equals("NaiveBayes")) {
			classifier = new NaiveBayes();
			// ((NaiveBayes) classifier).setUseSupervisedDiscretization(true);
			return classifier;
		} else {
			throw new IllegalArgumentException("Classifier " + classifierName + " is not supported.");
		}
	}

	// public static void main(String[] args) throws Exception {
	// Concept concept = new Concept("");
	// concept.addSNP(new SNP("1"));
	// concept.addSNP(new SNP("2"));
	// List<Concept> concepts = new ArrayList<Concept>();
	// concepts.add(concept);
	//
	// Properties props = new Properties();
	// FileInputStream in = new FileInputStream(args[0]);
	// props.load(in);
	// in.close();
	// String trainFile = props.getProperty("train");
	// String testFile = props.getProperty("test");
	// String trainFullFile = props.getProperty("trainFull");
	// String testFullFile = props.getProperty("testFull");
	// Instances train = null, test = null, trainFull = null, testFull = null;
	// train = ExtractInstances.run(trainFile);
	// test = ExtractInstances.run(testFile);
	// trainFull = ExtractInstances.run(trainFullFile);
	// testFull = ExtractInstances.run(testFullFile);
	// setInstances(train, test, trainFull, testFull, 1);
	//
	// precomputeSamples(concepts, 1, 1000);
	// BufferedWriter output = new BufferedWriter(new FileWriter("aurocs.txt"));
	// for (double d : sampleAUROCs.get(2).get(0)) {
	// output.write("" + d + " ");
	// }
	// output.close();
	// }
}

class ComputeThread implements Runnable {

	ComputePredictivePower cpp;
	int numFeatures;
	int upper;
	long repNum;
	double [] aurocs;
	long iterNum;
	
	public ComputeThread(ComputePredictivePower cpp, int numFeatures, int upper, long repNum, double[] aurocs, long iterNum) {
		this.cpp = cpp;
		this.numFeatures = numFeatures;
		this.upper = upper;
		this.repNum = repNum;
		this.aurocs = aurocs;
		this.iterNum = iterNum;
	}
	
	@Override
	public void run() {
		try {
//			System.out.println("running");
			cpp.computeRandomAUROC(numFeatures, upper, repNum/*, aurocs*/, iterNum);
//			System.out.println("finished run");
		} catch (Exception e) {
			System.out.println("exception");
			e.printStackTrace();
		}
	}
	
}
