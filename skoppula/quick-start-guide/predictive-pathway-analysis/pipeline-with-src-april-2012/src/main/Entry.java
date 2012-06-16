package main;

import java.util.List;

import utilities.Utilities;

public class Entry implements Comparable<Entry> {

	private Concept concept;
	private List<Double> aurocs;
	private List<Double> sigValues;
	private Integer numSignificant;

	public Entry(Concept concept, List<Double> aurocs, List<Double> sigValues) {
		this.concept = concept;
		this.aurocs = aurocs;
		this.sigValues = sigValues;
		numSignificant = sigValues.size();
	}

	@Override
	public int compareTo(Entry other) {
		return -this.numSignificant.compareTo(other.numSignificant);
	}

	public String toString() {
		return "" + concept + "\t" + Utilities.colToString(aurocs) + "\t" + concept.numSNPs() + "\t"
				+ Utilities.colToString(concept.getGenes()) + "\t" + Utilities.colToString(concept.getSNPs()) + "\t"
				+ numSignificant + "\t" + Utilities.colToString(sigValues) + "\n";
	}

	public static String header() {
		return "Concept\tAUROC\t#SNPs\tGenes\tSNPs\t#Significant runs\tSignificance values\n";
	}
}
