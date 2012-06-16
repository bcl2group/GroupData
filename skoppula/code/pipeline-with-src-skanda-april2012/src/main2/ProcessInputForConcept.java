package main2;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import weka.core.Attribute;
import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class ProcessInputForConcept {
	
	public static List<Integer> convertFeaturesToIndices(Instances instances, Collection<String> features) {
		List<Integer> result = new LinkedList<Integer>();
		
		for (String feature : features) {
			Attribute attribute = instances.attribute(feature);
			if (attribute != null) {
				result.add(attribute.index());
			}
		}
		
		return result;
	}
	
	public static Instances run(Instances instances, int [] snpIndices, boolean add, int [] saveIndices) throws Exception {
		String snpIndicesString = "";
		
		for (Integer index : snpIndices) {
			snpIndicesString += "," + (index + 1);
		}
		if (add) {
			for (int save : saveIndices) {
				snpIndicesString += "," + (save + 1);
			}
		}
		
		// trim leading comma
		snpIndicesString = snpIndicesString.substring(1);
		
		String [] options = new String[]{"-V", "-R", snpIndicesString};

		Remove removeFilter = new Remove();
		removeFilter.setOptions(options);
		removeFilter.setInputFormat(instances);
		return Filter.useFilter(instances, removeFilter);
	}
}
