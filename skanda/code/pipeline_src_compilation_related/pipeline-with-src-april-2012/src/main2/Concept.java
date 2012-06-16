package main2;

import java.util.HashSet;
import java.util.Set;

public class Concept {
	private final String name;
	private final Set<Gene> genes;
	private final Set<SNP> snps;
	
	public Concept(String name) {
		this.name = name;
		this.genes = new HashSet<Gene>();
		this.snps = new HashSet<SNP>();
	}
	
	public void addGene(Gene gene) {
		genes.add(gene);
		for (SNP snp : gene.getSNPs()) {
			addSNP(snp);
		}
	}
	
	public Set<Gene> getGenes() {
		return genes;
	}
	
	public void clearGenes() {
		genes.clear();
	}
	
	private void addSNP(SNP snp) {
		snps.add(snp);
	}
	
	public Set<SNP> getSNPs() {
		return snps;
	}
	
	public int numSNPs() {
		return snps.size();
	}
	
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
}
