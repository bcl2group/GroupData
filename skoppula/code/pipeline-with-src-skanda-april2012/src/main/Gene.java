package main;

//import java.util.LinkedList;
//import java.util.List;

public class Gene implements Comparable<Gene> {
	private final String name;
//	private List<SNP> snps;
	
	public Gene(String name) {
		this.name = name;
//		snps = new LinkedList<SNP>();
	}
	
//	public void addSNP(SNP snp) {
//		snps.add(snp);
//	}

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
		return true;
	}

	@Override
	public int compareTo(Gene other) {
		return this.name.compareTo(other.name);
	}
	
	public String toString() {
		return name;
	}
}
