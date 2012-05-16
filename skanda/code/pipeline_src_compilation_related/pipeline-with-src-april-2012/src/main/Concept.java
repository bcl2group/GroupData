package main;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Concept implements Comparable<Concept> {
	private final String name;
	private final List<Gene> genes;
	private final List<SNP> snps;
//	private List<Double> pValues;
//	private List<Double> aurocs;
//	private List<Boolean> isSignificant;
//	private boolean containsSignificantRepetition;
	
	public Concept(String name) {
		this.name = name;
		this.genes = new LinkedList<Gene>();
		this.snps = new LinkedList<SNP>();
//		aurocs = new ArrayList<Double>();
//		pValues = new ArrayList<Double>();
//		isSignificant = new ArrayList<Boolean>();
//		containsSignificantRepetition = false;
	}
	
	public void addGene(Gene gene) {
		genes.add(gene);
	}
	
	public List<Gene> getGenes() {
		return genes;
	}
	
	public void addSNP(SNP snp) {
		snps.add(snp);
	}
	
	public List<SNP> getSNPs() {
		return snps;
	}
	
	public int numSNPs() {
		return snps.size();
	}
	
//	public void addAUROC(double auroc) {
//		if (auroc < 0.0 || auroc > 1.0) {
//			throw new IllegalArgumentException("AUROC value " + auroc + " does not lie in [0,1]");
//		}
//		aurocs.add(auroc);
//	}
//	
//	public List<Double> getAUROCs() {
//		return aurocs;
//	}
//	
//	public void addPValue(double pValue) {
//		if (pValue < 0.0 || pValue > 1.0) {
//			throw new IllegalArgumentException("P-value " + pValue + " does not lie in [0,1]");
//		}
//		pValues.add(pValue);
//		isSignificant.add(false);
//	}
//	
//	public List<Double> getPValues() {
//		return pValues;
//	}
//	
//	public void setSignificance(int repetitionNum, boolean significant) {
//		isSignificant.set(repetitionNum, significant);
//		if (!containsSignificantRepetition && significant) {
//			containsSignificantRepetition = true;
//		}
//	}
//	
//	public boolean isSignificant(int repetitionNum) {
//		return isSignificant.get(repetitionNum);
//	}
//	
//	public boolean containsSignificantRepetition() {
//		return containsSignificantRepetition;
//	}
	
	public String toString() {
		return name;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof Concept)) {
			return false;
		}
		Concept other = (Concept) obj;
		if (name == null) {
			if (other.name != null) {
				return false;
			}
		} else if (!name.equals(other.name)) {
			return false;
		}
		return true;
	}

	@Override
	public int compareTo(Concept other) {
		return this.name.compareTo(other.name);
	}
}
