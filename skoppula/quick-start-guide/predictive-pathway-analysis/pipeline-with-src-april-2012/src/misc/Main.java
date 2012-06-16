package misc;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import main2.ExtractInstances;
import main2.ProcessInputForConcept;
import utilities.Utilities;
import weka.core.Instances;
import weka.core.converters.ArffSaver;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class Main {
	public static void main(String[] args) throws Exception {
		String option = args[0];

		if (option.equalsIgnoreCase("extractSubset")) {
			String sourcePath = args[1];
			String outputPath = args[2];
			int numGenes = Integer.parseInt(args[3]);
			
			Instances trainFull = ExtractInstances.run(sourcePath);
			int[] modelGeneIndices = new int[numGenes];
			for (int i = 0; i < numGenes; ++i) {
				modelGeneIndices[i] = i;
			}

			Instances newTrain = ProcessInputForConcept.run(trainFull, modelGeneIndices, true,
					new int[] { trainFull.numAttributes() - 1 });
			ArffSaver saver = new ArffSaver();
			saver.setInstances(newTrain);
			saver.setFile(new File(outputPath));
			saver.writeBatch();
		} else if (option.equalsIgnoreCase("randomPartition")) {
			String sourcePath = args[1];
			int numTraining = Integer.parseInt(args[2]);
			String trainOutputPath = args[3];
			String testOutputPath = args[4];
			
			Instances trainFull = ExtractInstances.run(sourcePath);
			int numTotal = trainFull.numInstances();
			if (numTotal < numTraining) {
				System.err.println("Not enough instances for partition");
				System.exit(1);
			}
			int [] indices = Utilities.randomSubset(trainFull.numInstances(), numTraining, new Random());
			Arrays.sort(indices);
			
			Instances newTrain = new Instances(trainFull, numTraining);
			Instances newTest = new Instances(trainFull, numTotal - numTraining);
			int j = 0;
			for (int i = 0; i < numTotal; ++i) {
				if (j < indices.length && indices[j] == i) {
					newTrain.add(trainFull.instance(i));
					++j;
				} else {
					newTest.add(trainFull.instance(i));
				}
			}
			
			ArffSaver saver = new ArffSaver();
			saver.setInstances(newTrain);
			saver.setFile(new File(trainOutputPath));
			saver.writeBatch();
			
			saver = new ArffSaver();
			saver.setInstances(newTest);
			saver.setFile(new File(testOutputPath));
			saver.writeBatch();
		} else if (option.equalsIgnoreCase("extractFromList")) {
			String sourcePath = args[1];
			String listPath = args[2];
			String outputPath = args[3];
			
			Instances source = ExtractInstances.run(sourcePath);
			BufferedReader input = new BufferedReader(new FileReader(listPath));
			
			List<String> features = new LinkedList<String>();
			String line = null;
			while ((line = input.readLine()) != null) {
				features.add(line);
			}
			List<Integer> indices = ProcessInputForConcept.convertFeaturesToIndices(source, features);
			
			String snpIndicesString = "";
			for (Integer index : indices) {
				snpIndicesString += "," + (index + 1);
			}
			// trim leading comma
			snpIndicesString = snpIndicesString.substring(1);
			String [] options = new String[]{"-V", "-R", snpIndicesString};

			Remove removeFilter = new Remove();
			removeFilter.setOptions(options);
			removeFilter.setInputFormat(source);
			Instances newInstances = Filter.useFilter(source, removeFilter);
			
			ArffSaver saver = new ArffSaver();
			saver.setInstances(newInstances);
			saver.setFile(new File(outputPath));
			saver.writeBatch();
		}
		
		System.out.println("Done");
	}

	private static void selectFromModelHeader() throws IOException, Exception {
		Instances train = ExtractInstances.run("genedata/HIVtrain_fdr_0.1.arff");
		Instances trainFull = ExtractInstances.run("genedata/HIVtrain_bg.arff");
		String outputPath = "genedata/HIVtrain_fdr_0.1_2.arff";

		List<String> modelGeneStrs = new ArrayList<String>();
		for (int i = 0; i < train.numAttributes() - 1; ++i) {
			modelGeneStrs.add(train.attribute(i).name());
		}

		List<Integer> modelGeneIndices = ProcessInputForConcept.convertFeaturesToIndices(trainFull, modelGeneStrs);
		int[] indexArray = new int[modelGeneIndices.size()];
		int arrayInd = 0;
		for (Integer modelGeneIndex : modelGeneIndices) {
			indexArray[arrayInd++] = modelGeneIndex;
		}

		Instances newTrain = ProcessInputForConcept.run(trainFull, indexArray, true,
				new int[] { trainFull.numAttributes() - 1 });

		ArffSaver saver = new ArffSaver();
		saver.setInstances(newTrain);
		saver.setFile(new File(outputPath));
		saver.writeBatch();
	}
}
