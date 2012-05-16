package misc;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import utilities.Utilities;

public class ConvertGSEAToARFF {
	public static void run(String gctFile, String clsFile, String outputFile) throws IOException {
		// read GCT file for gene expression data
		BufferedReader gctInput = new BufferedReader(new FileReader(gctFile));
		
		// ignore first line - version number only
		gctInput.readLine();
		
		// next line indicates number of genes and number of patients
		String info = gctInput.readLine();
		int numGenes = Integer.parseInt(info.split("\\t")[0]);
		int numPatients = Integer.parseInt(info.split("\\t")[1]);
		
		//ignore next line - headers only
		gctInput.readLine();
		
		String [] geneList = new String[numGenes];
		double [][] patientExpression = new double[numPatients][numGenes];
		for (int i = 0; i < numGenes; i++) {
			String nextLine = gctInput.readLine();
			String [] components = nextLine.split("\\t");
			
			// gene name is first column - if there are multiple gene names separated by three slashes, then convert 
			// them to dashes
			geneList[i] = components[0].replace(" /// ", "-");
			
			// ignore second column - description
			// patient data starting from third column
			for (int j = 0; j < numPatients; j++) {
				patientExpression[j][i] = Double.parseDouble(components[j + 2]);
			}
		}
		
		gctInput.close();
		
		
		// read CLS file for phenotype data
		BufferedReader clsInput = new BufferedReader(new FileReader(clsFile));
		
		// ignore first line - gives number of patients and number of phenotypes, which is redundant
		clsInput.readLine();
		
		// ignore second line - gives names of phenotypes, which may not match the next line
		clsInput.readLine();
		
		String [] phenotypeComponents = clsInput.readLine().split(" ");
		Set<String> phenotypes = new HashSet<String>();
		String [] patientPhenotypes = new String[numPatients];
		for (int i = 0; i < numPatients; i++) {
			String nextPh = phenotypeComponents[i];
			phenotypes.add(nextPh);
			patientPhenotypes[i] = nextPh;
		}
		
		
		// write Weka ARFF file
		BufferedWriter output = new BufferedWriter(new FileWriter(outputFile));
		output.write("@relation " + outputFile + "\n\n");
		
		// write attributes (gene names and phenotype)
		for (int i = 0; i < numGenes; i++) {
			output.write("@attribute \"" + geneList[i] + "\" real\n");
		}
		output.write("@attribute phenotype {" + Utilities.colToString(phenotypes) + "}\n\n");
		
		// write patient data
		output.write("@data");
		for (int i = 0; i < numPatients; i++) {
			output.write("\n");
			for (int j = 0; j < numGenes; j++) {
				output.write(patientExpression[i][j] + ",");
			}
			output.write(patientPhenotypes[i]);
		}
		output.close();
	}
	
	public static void main(String [] args) throws IOException {
		run(args[0], args[1], args[2]);
	}
}
