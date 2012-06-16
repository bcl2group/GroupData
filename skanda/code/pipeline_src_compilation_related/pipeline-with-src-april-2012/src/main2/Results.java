package main2;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


public class Results {
	private final int repetitions;
	private ArrayList<List<ResultsEntry>> resultsTables;
	private ArrayList<Map<Concept, Double>> resultsMaps;
	
	public Results(int repetitions) {
		this.repetitions = repetitions;
		if (repetitions < 1) {
			throw new IllegalArgumentException("Results must contain at least one repetition");
		}
		
		resultsTables = new ArrayList<List<ResultsEntry>>(repetitions);
		resultsMaps = new ArrayList<Map<Concept, Double>>();
		
		for (int i = 0; i < repetitions; ++i) {
			resultsTables.add(new LinkedList<ResultsEntry>());
			resultsMaps.add(new HashMap<Concept, Double>());
		}
	}
	
	public void addEntry(int repNum, Concept concept, double auroc, double pValue) {
		resultsTables.get(repNum).add(new ResultsEntry(concept, auroc, pValue));
		resultsMaps.get(repNum).put(concept, pValue);
	}
	
	public Map<Concept, Double> getMap(int repNum) {
		return resultsMaps.get(repNum);
	}
	
	public List<ResultsEntry> getTable(int repNum) {
		return resultsTables.get(repNum);
	}
	
	public List<Concept> getConcepts() {
		List<Concept> list = new LinkedList<Concept>();
		for (ResultsEntry re : resultsTables.get(0)) {
			list.add(re.concept);
		}
		return list;
	}
	
	public ResultsEntry getResultsEntry(int repNum, Concept concept) {
		for (ResultsEntry re : resultsTables.get(repNum)) {
			if (re.concept.equals(concept)) {
				return re;
			}
		}
		return null;
	}
	
	public double getPValue(int repNum, Concept concept) {
		return getResultsEntry(repNum, concept).pValue;
	}
	
	public double getAUROC(int repNum, Concept concept) {
		return getResultsEntry(repNum, concept).auroc;
	}
}