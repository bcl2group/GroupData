package misc;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import utilities.Utilities;
import weka.core.Instances;
import weka.core.converters.ArffSaver;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

import main2.ExtractInstances;
import main2.ProcessInputForConcept;

public class ExtractSNPsFromGraph {
	public static void main(String [] args) throws Exception {
		String graphFile = args[0];
		BufferedReader input = new BufferedReader(new FileReader(graphFile));
		
		List<String> features = new ArrayList<String>();
		String line = null;
		Pattern pattern = Pattern.compile("<NAME>(.*)</NAME>");
		while ((line = input.readLine()) != null) {
			Matcher matcher = pattern.matcher(line);
			while(matcher.find()) {
				String SNPname = matcher.group(1);
				features.add(SNPname);
			}
		}
		
		Instances instances = ExtractInstances.run(args[1]);
		List<Integer> indices = ProcessInputForConcept.convertFeaturesToIndices(instances, features);
//		indices.add(0);
//		indices.add(1);
//		indices.add(2);
		
		String snpIndicesString = "";
		for (Integer index : indices) {
			snpIndicesString += "," + (index + 1);
		}
		// trim leading comma
		snpIndicesString = snpIndicesString.substring(1);
		String [] options = new String[]{"-V", "-R", snpIndicesString};

		Remove removeFilter = new Remove();
		removeFilter.setOptions(options);
		removeFilter.setInputFormat(instances);
		Instances newInstances = Filter.useFilter(instances, removeFilter);
		
		ArffSaver saver = new ArffSaver();
		saver.setInstances(newInstances);
		saver.setFile(new File(args[2]));
		saver.writeBatch();
	}
}
