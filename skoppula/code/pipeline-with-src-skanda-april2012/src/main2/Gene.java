package main2;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * A class representing a gene. Each gene is associated with SNPs in the model.
 * 
 * @author Kent
 */
public class Gene {
	private final String name;
	private final Set<SNP> snps;
	
	public Gene(String name) {
		this.name = name;
		snps = new HashSet<SNP>();
	}
	
	public void addSNP(SNP snp) {
		snps.add(snp);
	}
	
	public Collection<SNP> getSNPs() {
		return snps;
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
		result = prime * result + ((snps == null) ? 0 : snps.hashCode());
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
		if (!(obj instanceof Gene)) {
			return false;
		}
		Gene other = (Gene) obj;
		if (name == null) {
			if (other.name != null) {
				return false;
			}
		} else if (!name.equals(other.name)) {
			return false;
		}
		if (snps == null) {
			if (other.snps != null) {
				return false;
			}
		} else if (!snps.equals(other.snps)) {
			return false;
		}
		return true;
	}
}