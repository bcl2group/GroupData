package main;

public enum MHC {
	BONFERRONI("Bonferroni"), BENJAMINI_HOCHBERG("Benjamini-Hochberg_FDR"), NONE("None"), STOREY("Storey_FDR");
	
	private final String name;
	
	private MHC(String name) {
		this.name = name;
	}
	
	public String toString() {
		return name;
	}
	
//	public static MHC getMHC(String name) {
//		for (MHC mhc : MHC.values()) {
//			if (mhc.name.equals(name)) {
//				return mhc;
//			}
//		}
//		
//		return null;
//	}
}
