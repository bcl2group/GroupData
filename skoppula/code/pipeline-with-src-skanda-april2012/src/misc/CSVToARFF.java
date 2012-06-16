package misc;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import utilities.Utilities;

public class CSVToARFF {

	public static void main(String[] args) throws IOException {
		run(args[0], args[1]);
	}

	public static void run(String csvFile, String arffFile) throws IOException {
		BufferedReader input = new BufferedReader(new FileReader(csvFile));

		String header = input.readLine();
		String[] attributes = header.split(",");
		LinkedHashMap<String, Set<String>> labels = new LinkedHashMap<String, Set<String>>();
		for (String attribute : attributes) {
			labels.put(attribute, new HashSet<String>());
		}

		String line = null;
		// int lineNumber = 0;
		while ((line = input.readLine()) != null) {
			if (line.trim().equals("")) {
				continue;
			}

			String[] values = line.split(",");
			int index = 0;
			for (Map.Entry<String, Set<String>> entry : labels.entrySet()) {
				// String attribute = entry.getKey();
				String nextValue = values[index++].trim();
				if (!nextValue.equals("?")) {
					entry.getValue().add(nextValue);
				}
			}

			// ++lineNumber;
			// if (lineNumber % 50 == 0) {
			// System.out.println(lineNumber);
			// }
		}

		input.close();

		BufferedWriter output = new BufferedWriter(new FileWriter(arffFile));
		output.write("@relation \'" + csvFile + "\'\n\n");

		for (Map.Entry<String, Set<String>> entry : labels.entrySet()) {
			output.write("@attribute " + entry.getKey() + " {" + Utilities.colToString(entry.getValue()) + "}\n");
		}
		output.write("\n@data");

		input = new BufferedReader(new FileReader(csvFile));
		input.readLine();

		while ((line = input.readLine()) != null) {
			output.write("\n" + line);
		}
		output.close();
	}

}
