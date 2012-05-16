package main2;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.TreeMap;

import cern.colt.Arrays;

import utilities.NamedSet;

public class MapConceptToGenes {
	
//	public static void main(String [] args) throws IOException {
//		String conceptsToGenesFileName = args[0];
//		Map<Concept, LinkedList<Gene>> map = run(conceptsToGenesFileName);
//		for (Concept concept : map.keySet()) {
//			System.out.println("Concept: " + concept);
//			System.out.println("Genes: " + map.get(concept));
//			System.out.println("============");
//		}
//	}
	
//	private final String conceptToGenes;
	
	public MapConceptToGenes(Properties p) {
//		conceptToGenes = p.getProperty("conceptToGenes");
	}
	
	public NamedSet<Concept> run(NamedSet<Gene> genes, String ontologyPath) throws IOException {
		NamedSet<Concept> concepts = new NamedSet<Concept>();
		
		BufferedReader input = new BufferedReader(new FileReader(ontologyPath));
//		BufferedReader input = new BufferedReader(new FileReader(conceptToGenes));
		String line = null;
		while ((line = input.readLine()) != null) {
			String [] components = line.split("\\s");
//			System.out.println(Arrays.toString(components));
			Concept concept = new Concept(components[0]);
			for (int i = 2; i < components.length; i++) {
				if (genes.contains(components[i])) {
					concept.addGene(genes.get(components[i]));
				} else {
					concept.addGene(new Gene(components[i]));
				}
			}
//			if (concept.numSNPs() != 0) {
//				concepts.add(concept);
//			}
			concepts.add(concept);
		}
		input.close();
		
//		System.out.println(concepts);
		
		return concepts;
	}
}
