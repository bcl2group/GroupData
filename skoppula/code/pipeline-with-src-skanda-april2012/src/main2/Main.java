package main2;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import utilities.NamedSet;
import utilities.Utilities;

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

	static ComputePredictivePower cpp;

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
//		PrintStream newOut = new PrintStream("log.txt"); // use this to log to file
//		PrintStream oldOut = System.out;
		// PrintStream newOut = new PrintStream(new ByteArrayOutputStream());
//		System.setOut(newOut);

		// read all parameters from the given properties file
		try {
			Properties props = new Properties();
			FileInputStream in = new FileInputStream(args[0]);
			props.load(in);
			in.close();
			
			String suppressErrorStr = props.getProperty("suppressErrors", "n");
			
			//if "n" = false, if "y" = true
			boolean suppressErrors = !suppressErrorStr.trim().equalsIgnoreCase("n");
			if (suppressErrors) {
				// suppress all messages written to System.err - useful because Weka complains about discretization
				PrintStream oldErr = System.err;
				PrintStream newErr = new PrintStream("pipeline_error_log.txt"); // use this to log to file
				System.setErr(newErr);
			}

			cpp = new ComputePredictivePower(props);

			String conceptToGenesList = props.getProperty("conceptToGenesList");
			
			//components array is list of ontology databases to iterate through
			String[] components = conceptToGenesList.split("\n");
			
			//Iterates over all the two or more concept list databases (ex. KEGG and GO)
			for (String str : components) {
				//ONTOLOGY DATABASE DIRECTORY, DB NAME, properties)
				run(str.split("\t")[0], str.split("\t")[1], props);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	//ontologyPath = directory of the conceptToGenesList
	//ontologyName = database name (ex. KEGG)
	public static void run(String ontologyPath, String ontologyName, Properties props) throws Exception {

		int repetitions = Integer.parseInt(props.getProperty("repetitions", "1"));
		// long seed = Long.parseLong(props.getProperty("seed", "0"));
		String alphaValues = props.getProperty("alpha", "0.05");
		String correctionStr = props.getProperty("corrections", "None");
		String outputDir = props.getProperty("outputDir", "");
		String pValuesFile = props.getProperty("savePValuesFileName", "");
		boolean savePValues = !pValuesFile.equals("");

		// check which multi-hypothesis corrections (MHC) are desired
		//corrections holds all the "enum based" corrections
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

		// parse desired alpha values
		List<Double> alphas = new LinkedList<Double>();
		for (String alphaStr : alphaValues.split(",|\\s")) {
			alphas.add(Double.parseDouble(alphaStr));
		}

		// make the output directory if it doesn't exist
		(new File(outputDir)).mkdirs();

		// check whether data is SNP data or gene data
		// if snp data, then need table to convert from SNPs to genes
		boolean isSNPData = props.getProperty("isSNPData", "y").equals("y");
		
		//list of all genes in WGA annotation
		NamedSet<Gene> genes = new NamedSet<Gene>();
		if (isSNPData) {
			System.out.println("- Extracting gene symbols ...");
			genes = new ExtractGeneSymbols(props).run();
		}

		System.out.println("==================");
		System.out.println("Processing " + ontologyName);
		System.out.println("==================\n");

		System.out.println("- Mapping concepts to genes/SNPs using " + ontologyPath + "...");
		NamedSet<Concept> conceptSet = new MapConceptToGenes(props).run(genes, ontologyPath);

		Results results;

		if (props.getProperty("calculateFisher", "n").equalsIgnoreCase("y")) {
			System.out.println(" - Running traditional enrichment");
			FisherEnrichment fe = new FisherEnrichment(props);
			results = fe.run(conceptSet, genes);
		} else {
			System.out.println("- Computing predictive power ...");
			// Results results = ComputePredictivePower.run(snps,
			// lowerThreshold, upperThreshold, iterations,
			// repetitions);
			results = cpp.run(conceptSet);
		}

		if (savePValues) {
			savePValuesToFile(repetitions, pValuesFile, ontologyName, results);
		}

		for (MHC mhc : corrections) {
			for (Double alpha : alphas) {
				//Map of concepts -> ()
				Map<Concept, List<Pair<Double, Double>>> sigConcepts = new HashMap<Concept, List<Pair<Double, Double>>>();
				//List of all concepts
				List<Concept> concepts = results.getConcepts();
				for (Concept concept : concepts) {
					sigConcepts.put(concept, new LinkedList<Pair<Double, Double>>());
				}
				for (int repNum = 0; repNum < repetitions; ++repNum) {
					List<Double> pValues = new LinkedList<Double>();
					for (Concept concept : concepts) {
						pValues.add(results.getPValue(repNum, concept));
					}
					// List<SigValue> sigConceptList =
					// FindSignificantConcepts.run(pValues, mhc, alpha);
					
					//Apply corrections to Pvalues list for certain alpha and save it to sigConceptList
					List<SigValue> sigConceptList = MHC.run(pValues, mhc, alpha);
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
				// String outputFile = outputDir + ontologyName + "_" + mhc + "_alpha=" + alpha + ".txt";
				String outputFile = outputDir + mhc + "_alpha=" + alpha + "_" + ontologyName + ".txt";
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
						entries.add(new Entry(concept, aurocs, sigValues, isSNPData));
					}
				}
				Collections.sort(entries);
				for (Entry entry : entries) {
					Utilities.appendLineToFile(entry.toString(), outputFile);
				}
			}
		}
		// }

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
