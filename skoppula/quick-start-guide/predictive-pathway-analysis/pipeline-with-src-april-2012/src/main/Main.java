package main;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.TreeSet;

import utilities.Utilities;
import weka.core.Instance;
import weka.core.Instances;

// TODO update documentation

/**
 * Class which coordinates running the pipeline on a given set of files. See {@link #main(String[])} for a more detailed
 * description of inputs and functionality.
 * 
 * @author Kent
 * 
 */
public class Main {

	static Map<Concept, List<Double>> allPValues = new HashMap<Concept, List<Double>>();

	/**
	 * Runs the pipeline with the given arguments, as follows:
	 * <OL>
	 * <LI>File location of a table containing relevant SNP's mapped to genes. The format of this space-delimited table
	 * is assumed to be as follows: name of SNP in first column, gene name in the sixth column (possibly with an
	 * accession label, which is assumed to be greater in length than the gene name), and distance to gene in the
	 * seventh column.</LI>
	 * <LI>File location of a tab-delimited table of file locations, of the different ontologies. The first column of
	 * the table is the file location of the ontology, and the second column is a shorthand name. Each ontology contains
	 * a space-delimited table of concepts mapped to genes, where the first column contains the name of the concept, and
	 * the third column onward contains the names of the genes.</LI>
	 * <LI>Integer indicating the minimum number of SNPs that a concept must be related to in order for it to be tested.
	 * </LI>
	 * <LI>Integer indicating the number of times the pipeline should be run with random sampling, by merging the given
	 * training and testing data. If this number is 0, then it is assumed that the training and testing data were
	 * obtained separately and thus should not be merged.
	 * <LI>File location of an enriched set of data to train selected concepts on. This file is in csv format, where the
	 * last three features are assumed to be non-SNP attributes, and the last feature is the class.</LI>
	 * <LI>File location of an enriched set of data to train selected concepts on. This file is in csv format, with the
	 * same attributes as the fourth argument.</LI>
	 * <LI>File location of a general set of data to train random sets of SNPs on. This is to determine whether the
	 * predictive power of the selected concepts are significant. The file is in arff format, where the last three
	 * features are assumed to be non-SNP attributes, and the last feature is the class.</LI>
	 * <LI>File location of a general set of data to test random sets of SNPs on. The file is in arff format, with the
	 * same attributes as the sixth argument.</LI>
	 * <LI>Multiple hypothesis correction to be applied to the results. This should be input as a comma-delimited list
	 * without any spaces. See {@link MHC} for the names of valid correction schema. Alternatively, the value "-all"
	 * indicates that all schema will be used.</LI>
	 * <LI>Directory in which the resultant lists of significant concepts (one for each ontology specified in the second
	 * argument) should be placed. This argument is optional; if it is missing, then the results will be placed in the
	 * default folder used by Java.</LI>
	 * </OL>
	 * 
	 * @param args
	 *            list of String arguments, as described above.
	 * @throws Exception
	 *             if any error occurred during execution of the pipeline.
	 */
	public static void main(String[] args) throws IOException {
		// read all parameters from the given properties file
		try {
			run(args[0]);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void run(/*
							 * String snpsToGenesFileName, String conceptsToGenesFileName, int threshold, int
							 * repetitions, String trainCSVFileName, String testCSVFileName, String
							 * trainFullARFFFileName, String testFullARFFFileName, String corrections, String outputDir,
							 * String ontologyName
							 */String propertiesFile) throws Exception {
		Properties props = new Properties();
		FileInputStream in = new FileInputStream(propertiesFile);
		props.load(in);
		in.close();

		String snpsToGenesFileName = props.getProperty("snpToGenes");
		String conceptToGenesFileList = props.getProperty("conceptToGenesList");
		int lowerThreshold = Integer.parseInt(props.getProperty("lowerThreshold", "2"));
		int upperThreshold = Integer.parseInt(props.getProperty("upperThreshold", "100"));
		int repetitions = Integer.parseInt(props.getProperty("repetitions", "0"));
		int iterations = Integer.parseInt(props.getProperty("iterations", "1000"));
		// long seed = Long.parseLong(props.getProperty("seed", "0"));
		String trainFile = props.getProperty("train");
		String testFile = props.getProperty("test");
		String trainFullFile = props.getProperty("trainFull");
		String testFullFile = props.getProperty("testFull");
		double alpha = Double.parseDouble(props.getProperty("alpha", "0.05"));
		String correctionStr = props.getProperty("corrections", "None");
		String outputDir = props.getProperty("outputDir", "");
		String pValuesFile = props.getProperty("savePValuesFileName", "");
		boolean savePValues = !pValuesFile.equals("");

		// check which multi-hypothesis corrections are desired
		List<MHC> corrections = new LinkedList<MHC>();
		if (correctionStr.equals("all")) {
			corrections = Arrays.asList(MHC.values());
		} else {
			String[] components = correctionStr.split(",|\\s");
			for (String component : components) {
				if (!component.equals("")) {
					corrections.add(/* MHC.getMHC(component) */MHC.valueOf(component));
				}
			}
		}

		// make the output directory if it doesn't exist
		(new File(outputDir)).mkdirs();

		System.out.println("- Extracting data sets");
		Instances train = null, test = null, trainFull = null, testFull = null;
		train = ExtractInstances.run(trainFile);
		test = ExtractInstances.run(testFile);
		trainFull = ExtractInstances.run(trainFullFile);
		testFull = ExtractInstances.run(testFullFile);

		ComputePredictivePower.setInstances(train, test, trainFull, testFull, repetitions);

		BufferedReader input = new BufferedReader(new FileReader(conceptToGenesFileList));
		String line = null;
		while ((line = input.readLine()) != null) {
			String[] components = line.split("\t");
			String ontologyPath = components[0];
			String ontologyName = components[1];

			System.out.println("==================");
			System.out.println("Processing " + ontologyName);
			System.out.println("==================\n");

			System.out.println("- Extracting gene symbols ...");
			Map<Gene, LinkedList<SNP>> geneToSNPs = ExtractGeneSymbols.run(snpsToGenesFileName);
			System.out.println("- Mapping concepts to genes ...");
			Map<Concept, LinkedList<Gene>> conceptToGenes = MapConceptToGenes.run(ontologyPath);
			System.out.println("- Mapping concepts to SNPs ...");
			Map<Concept, TreeSet<SNP>> conceptToSNPs = MapConceptToSNPs.run(conceptToGenes, geneToSNPs);

			System.out.println("- Computing predictive power ...");
			Results results = ComputePredictivePower.run(conceptToSNPs, lowerThreshold, upperThreshold, iterations,
					repetitions);

			if (savePValues) {
				savePValuesToFile(repetitions, pValuesFile, ontologyName, results);
			}

			for (MHC mhc : corrections) {
				Map<Concept, List<Pair<Double, Double>>> sigConcepts = new HashMap<Concept, List<Pair<Double, Double>>>();
				List<Concept> concepts = results.getConcepts();
				for (Concept concept : concepts) {
					sigConcepts.put(concept, new LinkedList<Pair<Double, Double>>());
				}
				for (int repNum = 0; repNum < repetitions; ++repNum) {
					List<Double> pValues = new LinkedList<Double>();
					for (Concept concept : concepts) {
						pValues.add(results.getPValue(repNum, concept));
					}
					List<SigValue> sigConceptList = FindSignificantConcepts.run(pValues, mhc, alpha);
					for (int i = 0; i < concepts.size(); ++i) {
						if (sigConceptList.get(i).isSignificant) {
							Concept concept = concepts.get(i);
							double sigValue = sigConceptList.get(i).value;
							double auroc = results.getAUROC(repNum, concept);
							sigConcepts.get(concept).add(new Pair<Double, Double>(auroc, sigValue));
						}
					}
				}

				// output to file
				String outputFile = outputDir + ontologyName + "_" + mhc + ".txt";
				Utilities.writeLineToFile(Entry.header(), outputFile);
				// System.out.println("Correction: " + mhc);
				// Map<Concept, List<Double>> map = results.get(mhc);
				List<Entry> entries = new ArrayList<Entry>();
				for (Concept concept : sigConcepts.keySet()) {
					if (sigConcepts.get(concept).size() != 0) {
						List<Double> sigValues = new LinkedList<Double>();
						List<Double> aurocs = new LinkedList<Double>();
						for (Pair<Double, Double> pair : sigConcepts.get(concept)) {
							aurocs.add(pair.getKey());
							sigValues.add(pair.getValue());
						}
						entries.add(new Entry(concept, aurocs, sigValues));
					}
				}
				Collections.sort(entries);
				for (Entry entry : entries) {
					Utilities.appendLineToFile(entry.toString(), outputFile);
				}
			}
		}

		System.out.println("- Done");
	}

	private static void savePValuesToFile(int repetitions, String pValuesFile, String ontologyName, Results results)
			throws IOException {
		String outputFile = pValuesFile + "_" + ontologyName + ".txt";
		Utilities.writeLineToFile("", outputFile);
		for (Concept concept : results.getConcepts()) {
			Utilities.appendLineToFile(concept + "\t", outputFile);
			for (int repNum = 0; repNum < repetitions; ++repNum) {
				Utilities.appendLineToFile(String.valueOf(results.getPValue(repNum, concept)), outputFile);
				if (repNum < repetitions - 1) {
					Utilities.appendLineToFile(",", outputFile);
				}
				Utilities.appendLineToFile("\n", outputFile);
			}
		}
	}
}
