package main;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.Map;
import java.util.TreeMap;

public class MapConceptToGenes {
	
	public static void main(String [] args) throws IOException {
		String conceptsToGenesFileName = args[0];
		Map<Concept, LinkedList<Gene>> map = run(conceptsToGenesFileName);
		for (Concept concept : map.keySet()) {
			System.out.println("Concept: " + concept);
			System.out.println("Genes: " + map.get(concept));
			System.out.println("============");
		}
	}
	
	public static Map<Concept, LinkedList<Gene>> run(String conceptsToGenesFileName) throws IOException {
		Map<Concept, LinkedList<Gene>> map = new TreeMap<Concept, LinkedList<Gene>>();
		
		BufferedReader input = new BufferedReader(new FileReader(conceptsToGenesFileName));
		String line = null;
		while ((line = input.readLine()) != null) {
			String [] components = line.split("\\s");
			Concept concept = new Concept(components[0]);
			LinkedList<Gene> genes = new LinkedList<Gene>();
			for (int i = 2; i < components.length; i++) {
				Gene gene = new Gene(components[i]);
				genes.add(gene);
//				concept.addGene(gene);
			}
			
			map.put(concept, genes);
		}
		
		input.close();
		
		return map;
	}
}
