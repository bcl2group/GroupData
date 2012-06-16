package main2;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PipedInputStream;
import java.io.PipedOutputStream;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.regex.Pattern;

import weka.core.Instances;
import weka.core.converters.ArffLoader;

/**
 * Module for extracting data instances from a file. The supported formats are ARFF and CSV.
 * 
 * @author Kent
 * 
 */
public class ExtractInstances {
//	public static void main(String[] args) {
//		run(args[0]);
//	}

	/**
	 * Extracts an Instances object from the given file. If the file has a .ARFF extension, then it is assumed to be in
	 * Weka's ARFF format. Otherwise, it is assumed to be in CSV format.
	 * 
	 * @param file the location of the file containing the data.
	 */
	public static Instances run(String file) throws IOException {
		if (!Pattern.matches(".*\\.[Aa][Rr][Ff][Ff]\\s*$", file)) {
			// csv format
			return loadCSV(file);
		} else {
			// arff format
			ArffLoader loader = new ArffLoader();
			loader.setSource(new File(file));
			Instances instances = loader.getDataSet();
			instances.setClassIndex(instances.numAttributes() - 1);
			return instances;
		}
	}
	
	public static Instances loadCSV(String csvFileName) throws IOException {
		BufferedReader input = new BufferedReader(new FileReader(csvFileName));
		
		String [] attributeNames = null;
		ArrayList<LinkedList<String>> attributeValues = new ArrayList<LinkedList<String>>();
		boolean firstLine = true;
		
		String line = null;
		while ((line = input.readLine()) != null) {
			if (firstLine) {
				attributeNames = line.split(",");
				for (int i = 0; i < attributeNames.length; i++) {
					attributeValues.add(new LinkedList<String>());
				}
				
				firstLine = false;
			} else {
				String [] values = line.split(",");
				for (int i = 0; i < values.length; i++) {
					if (!attributeValues.get(i).contains(values[i])) {
						attributeValues.get(i).add(values[i]);
					}
				}
			}
		}
		input.close();
		
		input = new BufferedReader(new FileReader(csvFileName));
		StringBuffer output = new StringBuffer();
		
		output.append("@relation " + csvFileName + "\n");
		output.append("\n");
		for (int iAttribute = 0; iAttribute < attributeNames.length; iAttribute++) {
			output.append("@attribute " + attributeNames[iAttribute] + " {");
			
//			Iterator<String> valuesIterator = attributeValues.get(iAttribute).iterator();
//			while (valuesIterator.hasNext()) {
//				output.write(valuesIterator.next());
//				if (valuesIterator.hasNext()) {
//					output.write(",");
//				}
//			}
			
			// TODO find a fix for missing attribute labels
			output.append("0,1");
			if (iAttribute < 426) {
				output.append(",2");
			}
			
			output.append("}\n");
		}
		output.append("\n@data\n");
		
		input.readLine();	// discard first line
		while ((line = input.readLine()) != null) {
			output.append(line + "\n");
		}
		
		input.close();
		InputStream arffInput = new ByteArrayInputStream(output.toString().getBytes());
		
		ArffLoader loader = new ArffLoader();
		loader.setSource(arffInput);
		Instances instances = loader.getDataSet();
		instances.setClassIndex(instances.numAttributes() - 1);
		return instances;
	}
}
