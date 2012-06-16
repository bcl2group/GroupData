package main;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

import weka.core.Attribute;
import weka.core.Instances;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class ProcessInputForConcept {
	
	public static List<Integer> convertSNPToIndices(Instances instances, Collection<SNP> snps) {
		List<Integer> result = new LinkedList<Integer>();
		
		for (SNP snp : snps) {
			Attribute attribute = instances.attribute(snp.toString());
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

//		System.out.print(snpIndicesString);
//		System.out.println();
//		System.out.println();
		
		String [] options = new String[]{"-V", "-R", snpIndicesString};

		Remove removeFilter = new Remove();
		removeFilter.setOptions(options);
		removeFilter.setInputFormat(instances);
		return Filter.useFilter(instances, removeFilter);
	}
}
