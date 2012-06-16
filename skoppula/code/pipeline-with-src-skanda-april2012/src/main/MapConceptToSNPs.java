package main;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.TreeSet;

public class MapConceptToSNPs {

	public static void main(String[] args) throws IOException {
		String snpsToGenesFileName = args[0];
		Map<Gene, LinkedList<SNP>> geneToSNPs = ExtractGeneSymbols.run(snpsToGenesFileName);
		String conceptsToGenesFileName = args[1];
		Map<Concept, LinkedList<Gene>> conceptToGenes = MapConceptToGenes.run(conceptsToGenesFileName);
		Map<Concept, TreeSet<SNP>> map = run(conceptToGenes, geneToSNPs);
		for (Concept concept : map.keySet()) {
			System.out.println("Concept: " + concept);
			System.out.println("SNPs: " + map.get(concept));
			System.out.println("============");
		}
	}

	public static Map<Concept, TreeSet<SNP>> run(Map<Concept, LinkedList<Gene>> conceptToGenes,
			Map<Gene, LinkedList<SNP>> geneToSNPs) {
		Map<Concept, TreeSet<SNP>> map = new HashMap<Concept, TreeSet<SNP>>();

		for (Concept concept : conceptToGenes.keySet()) {
			TreeSet<SNP> snpSet = new TreeSet<SNP>();
			for (Gene gene : conceptToGenes.get(concept)) {
				if (geneToSNPs.containsKey(gene)) {
					concept.addGene(gene);
					for (SNP snp : geneToSNPs.get(gene)) {
						snpSet.add(snp);
						concept.addSNP(snp);
					}
				}
			}
			map.put(concept, snpSet);
		}

		return map;
	}
}
