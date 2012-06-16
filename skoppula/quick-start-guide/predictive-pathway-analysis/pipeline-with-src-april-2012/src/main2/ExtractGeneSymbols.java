package main2;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import utilities.NamedSet;

public class ExtractGeneSymbols {

	private int distanceThreshold;
	private String snpToGenes;
	private int snpIndex;
	private int geneIndex;
	private int distanceIndex;
	private String delim;
	private boolean extendedAnnotation;
	
	Map<String, String> snpToGeneMap;

	public ExtractGeneSymbols(Properties p) {
		distanceThreshold = Integer.parseInt(p.getProperty("distanceThreshold", "5000"));
		snpToGenes = p.getProperty("snpToGenes");

		snpIndex = Integer.parseInt(p.getProperty("snpIndex", "0"));
		geneIndex = Integer.parseInt(p.getProperty("geneIndex", "5"));
		distanceIndex = Integer.parseInt(p.getProperty("distanceIndex", "6"));
		extendedAnnotation = p.getProperty("extendedAnnotation", "n").equals("y");
		delim = p.getProperty("delim", "\\s");
		
		snpToGeneMap = new HashMap<String, String>();
	}

	public void setSource(String snpToGenes) {
		this.snpToGenes = snpToGenes;
	}

	public void setIndices(int snpIndex, int geneIndex, int distanceIndex) {
		this.snpIndex = snpIndex;
		this.geneIndex = geneIndex;
		this.distanceIndex = distanceIndex;
	}

	public void setDelimiter(String delim) {
		this.delim = delim;
	}

	public NamedSet<Gene> run() throws IOException {
		NamedSet<Gene> genes = new NamedSet<Gene>();
		
		BufferedWriter output = new BufferedWriter(new FileWriter("annotation.txt"));

		System.out.println(snpToGenes);
		BufferedReader input = new BufferedReader(new FileReader(snpToGenes));
		String line = input.readLine();
		while ((line = input.readLine()) != null) {
			if (line.trim().equals("")) {
				continue;
			}
			//Each line of the WGA annotation file split into components
			String[] components = line.split(delim);

			if (distanceIndex >= 0) {
				Long distToGene = Long.valueOf(components[distanceIndex]);

				if (Math.abs(distToGene) >= distanceThreshold) {
					continue;
				}
			}

			SNP snp = new SNP(components[snpIndex]);

			// String accession = components[geneIndex];
			// String geneName = accession;
			// if (accession.contains(";")) {
			// String[] geneNames = accession.split(";");
			// if (geneNames[0].length() <= geneNames[1].length()) {
			// geneName = geneNames[0];
			// } else {
			// geneName = geneNames[1];
			// }
			// }
			
			//getGeneName() gets the smallest gene ID
			String geneName = getGeneName(components[geneIndex]);
			if (geneName == null || geneName.equalsIgnoreCase("N/A")) {
				continue;
			}
			
			output.write(snp.toString() + "\t" + geneName + "\n");
			snpToGeneMap.put(snp.toString(), geneName);

			//GENE MUST HAVE PROPERTY THAT IT HAS A LIST OF SNPS ASSOCIATED WITH IT
			if (genes.contains(geneName)) {
				genes.get(geneName).addSNP(snp);
			} else {
				Gene next = new Gene(geneName);
				next.addSNP(snp);
				genes.add(next);
			}
		}

		output.close();
		input.close();
		return genes;
	}

	
	private String getGeneName(String id) {
		String geneName = null;
		if (extendedAnnotation) {
			List<String> geneNames = new ArrayList<String>(Arrays.asList(id.split(";")));
			removeEmptyStrings(geneNames);
			List<String> qNames = new LinkedList<String>();
			while (geneName == null && !geneNames.isEmpty()) {
				String next = getSmallestString(geneNames);
				geneNames.remove(next);
				next = next.trim();
				if (next.startsWith("Q")) {
					qNames.add(next);
					continue;
				} else if (next.startsWith("Hs.")) {
					// ignore
					continue;
				} else if (next.startsWith("OTTHUM")) {
					// ignore
					continue;
				} else if (next.matches("[0-9\\[].*")) {
					// ignore
					continue;
				} else if (next.contains(" ")) {
					// ignore
					continue;
				}
				geneName = next;
			}

			if (geneName == null) {
				if (!qNames.isEmpty()) {
					geneName = getSmallestString(qNames);
				}
			}

//			System.out.println(id);
//			System.out.println("\t" + geneName);
			return geneName;
		} else {
			String accession = id;
			geneName = accession;
			if (accession.contains(";")) {
				String[] geneNames = accession.split(";");
				if (geneNames[0].length() <= geneNames[1].length()) {
					geneName = geneNames[0];
				} else {
					geneName = geneNames[1];
				}
			}
		}
		return geneName;
	}

	private String getSmallestString(List<String> geneNames) {
		String result = null;
		for (String string : geneNames) {
			if (result == null || string.trim().length() < result.trim().length()) {
				result = string;
			}
		}
		return result;
	}

	private void removeEmptyStrings(List<String> geneNames) {
		Iterator<String> iter = geneNames.iterator();
		while (iter.hasNext()) {
			String next = iter.next();
			if (next.trim().equals("")) {
				iter.remove();
			}
		}
	}
}
