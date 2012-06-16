package main;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;
import java.util.List;
import java.util.TreeMap;
import java.util.LinkedList;

import utilities.Utilities;


public class ExtractGeneSymbols {
	
	public final static long distanceThreshold = 5000;
	
	public static void main(String [] args) throws IOException {
		String snpsToGenesFileName = args[0];
		Map<Gene, LinkedList<SNP>> map = run(snpsToGenesFileName);
		
		BufferedWriter output = new BufferedWriter(new FileWriter(args[1]));
		for (Gene gene : map.keySet()) {
			output.write(gene + "\t" + Utilities.colToString(map.get(gene)) + "\n");
		}
		output.close();
	}
	
	public static Map<Gene, LinkedList<SNP>> run(String snpsToGenesFileName) throws IOException {
		Map<Gene, LinkedList<SNP>> map = new TreeMap<Gene, LinkedList<SNP>>();
		
		BufferedReader input = new BufferedReader(new FileReader(snpsToGenesFileName));
		String line = null;
		while ((line = input.readLine()) != null) {
			String [] components = line.split(" ");
			Long distToGene = Long.valueOf(components[6]);
			
			if (distToGene >= distanceThreshold) {
				continue;
			}
			
			SNP snp = new SNP(components[0]);
			
			String accession = components[5];
			String geneName = accession;
			if (accession.contains(";")) {
				String [] geneNames = accession.split(";");
				if (geneNames[0].length() <= geneNames[1].length()) {
					geneName = geneNames[0];
				} else {
					geneName = geneNames[1];
				}
			}
			
			Gene gene = new Gene(geneName);
			
			if (map.containsKey(gene)) {
				List<SNP> list = map.get(gene);
				list.add(snp);
			} else {
				LinkedList<SNP> list = new LinkedList<SNP>();
				list.add(snp);
				map.put(gene, list);
			}
		}
		
		input.close();
		
		return map;
	}
}
