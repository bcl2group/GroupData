package main2;

import java.util.LinkedList;
import java.util.List;

import utilities.Utilities;

public class Entry implements Comparable<Entry> {

	private Concept concept;
	private List<Double> aurocs;
	private List<Double> sigValues;
	private Integer numSignificant;
	private boolean isSNPData;

	public Entry(Concept concept, List<Double> aurocs, List<Double> sigValues, boolean isSNPData) {
		this.concept = concept;
		this.aurocs = aurocs;
		this.sigValues = sigValues;
		numSignificant = sigValues.size();
		this.isSNPData = isSNPData;
	}

	@Override
	public int compareTo(Entry other) {
		return -this.numSignificant.compareTo(other.numSignificant);
	}

	public String toString() {
		String geneList = Utilities.colToString(concept.getGenes());
		if (isSNPData) {
			List<Gene> genes = new LinkedList<Gene>();
			for (Gene gene : concept.getGenes()) {
				if (!gene.getSNPs().isEmpty()) {
					genes.add(gene);
				}
			}
			geneList = Utilities.colToString(genes);
		}
		return "" + concept + "\t" + Utilities.colToString(aurocs) + "\t" + concept.numSNPs() + "\t"
				+ geneList + "\t" + Utilities.colToString(concept.getSNPs()) + "\t"
				+ numSignificant + "\t" + Utilities.colToString(sigValues) + "\n";
	}

	public static String header() {
		return "Concept\tAUROC\t#SNPs\tGenes\tSNPs\t#Significant runs\tSignificance values\n";
	}
}
