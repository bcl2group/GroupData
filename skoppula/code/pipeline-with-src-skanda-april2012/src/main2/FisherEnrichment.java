package main2;

import java.io.IOException;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

import utilities.FishersExactTest;
import utilities.NamedSet;
import weka.core.Instances;

public class FisherEnrichment {
	private ExtractGeneSymbols egs;
	private boolean isSNPData;
	private String trainFullFile;
	private String trainFile;

	public FisherEnrichment(Properties p) throws IOException {
		isSNPData = p.getProperty("isSNPData", "y").equals("y");
		trainFullFile = p.getProperty("trainFull", null);
		trainFile = p.getProperty("train", null);

		egs = new ExtractGeneSymbols(p);
		egs.setIndices(0, 8, 9);
		egs.setSource(p.getProperty("backgroundModel"));
		egs.setDelimiter(",");
	}

	public Results run(NamedSet<Concept> concepts, NamedSet<Gene> modelGenes) throws IOException {
		Results results = new Results(1);
		NamedSet<Gene> backgroundGenes = null;
		if (isSNPData) {
			backgroundGenes = egs.run();

			Instances trainFull = ExtractInstances.run(trainFullFile);
			Instances train = ExtractInstances.run(trainFile);

			if (train == null || trainFull == null) {
				// error - can't run enrichment without model set
			} else {
				modelGenes = new NamedSet<Gene>();

				int numModel = train.numAttributes() - 1;
				for (int i = 0; i < numModel; i++) {
					String geneName = egs.snpToGeneMap.get(train.attribute(i).name());
					if (geneName != null) {
						modelGenes.add(new Gene(geneName));
					}
				}

				backgroundGenes = new NamedSet<Gene>();
				int numTotal = trainFull.numAttributes() - 1;
				for (int i = 0; i < numTotal; i++) {
					String geneName = egs.snpToGeneMap.get(trainFull.attribute(i).name());
					if (geneName != null) {
						Gene nextGene = new Gene(geneName);
						// if (!modelGenes.contains(nextGene)) {
						backgroundGenes.add(nextGene);
						// }
					}

				}
			}
		} else {
			Instances trainFull = ExtractInstances.run(trainFullFile);
			Instances train = ExtractInstances.run(trainFile);

			if (train == null || trainFull == null) {
				// error - can't run enrichment without model set
			} else {
				modelGenes = new NamedSet<Gene>();

				int numModel = train.numAttributes() - 1;
				for (int i = 0; i < numModel; i++) {
					modelGenes.add(new Gene(train.attribute(i).name()));
				}

				backgroundGenes = new NamedSet<Gene>();
				int numTotal = trainFull.numAttributes() - 1;
				for (int i = 0; i < numTotal; i++) {
					String nextGene = trainFull.attribute(i).name();
					if (!modelGenes.contains(nextGene)) {
						backgroundGenes.add(new Gene(nextGene));
					}
				}
			}
		}

		for (Concept concept : concepts) {
			int inModelAndConcept = 0;
			int inBGAndConcept = 0;

			Set<Gene> modelAndConceptGenes = new HashSet<Gene>();

			// calculate with background and model together
			for (Gene gene : concept.getGenes()) {
				if (modelGenes.contains(gene.toString())) {
					++inModelAndConcept;
				}
				if (backgroundGenes.contains(gene.toString())) {
					++inBGAndConcept;
				}
			}
			concept.clearGenes();
			for (Gene gene : modelAndConceptGenes) {
				concept.addGene(gene);
			}
			int inModelNotConcept = modelGenes.size() - inModelAndConcept;
			int inBGNotConcept = backgroundGenes.size() - inBGAndConcept;

			// calculate with background and model separate
//			for (Gene gene : concept.getGenes()) {
//				if (modelGenes.contains(gene.toString())) {
//					++inModelAndConcept;
//					modelAndConceptGenes.add(gene);
//				} else if (backgroundGenes.contains(gene.toString())) {
//					++inBGAndConcept;
//				}
//			}
//
//			concept.clearGenes();
//			for (Gene gene : modelAndConceptGenes) {
//				concept.addGene(gene);
//			}
//			int inModelNotConcept = modelGenes.size() - inModelAndConcept;
//			int inBGNotConcept = backgroundGenes.size() - inBGAndConcept - inModelAndConcept - inModelNotConcept;

			System.out.println(concept);
			System.out.println(inModelAndConcept + " " + inBGAndConcept);
			System.out.println(inModelNotConcept + " " + inBGNotConcept);
			double pValue = FishersExactTest.run(inModelAndConcept, inBGAndConcept, inModelNotConcept, inBGNotConcept);
			System.out.println(pValue);
			results.addEntry(0, concept, (double) (inModelAndConcept) / (inModelAndConcept + inModelNotConcept), pValue);
		}

		return results;
	}
}
