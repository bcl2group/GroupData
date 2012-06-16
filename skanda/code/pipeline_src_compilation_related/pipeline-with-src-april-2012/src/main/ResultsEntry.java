package main;

public class ResultsEntry {
	Concept concept;
	double auroc;
	double pValue;
	
	ResultsEntry(Concept concept, double auroc, double pValue) {
		this.concept = concept;
		this.auroc = auroc;
		this.pValue = pValue;
	}
	
	public boolean sharesConcept(ResultsEntry other) {
		return this.concept.equals(other.concept);
	}
}
