import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

/*
 * Author:			Skanda Koppula
 * Date Updated: 	February 24, 2011
 * Purpose:			Generates text files Each with 1000 SNPs 
 * 					from the main coga-sync dataset.
 */

public class SelectFromCompleteDataSet {
	public static void main(String[] args) throws IOException{
		
		final String SNPLISTPATH = "C:/home/skanda/PRIMES/data/coga-sync.csv";
		final int numSNPs = 10000;
		final String OUTPUTFILE = "C:/home/skanda/PRIMES/data/coga-sync-0-" + numSNPs+ ".wr";
		
		BufferedReader input = new BufferedReader(new FileReader(SNPLISTPATH));

		//Create Fresh Output File
		FileWriter output = new FileWriter(OUTPUTFILE);
		output = new FileWriter(OUTPUTFILE, true);
		String SNP = "";
		
		int counter = 0;
		
		char nextChar = (char) input.read();
		while(counter<numSNPs){
			while(nextChar!=44){
				SNP+=nextChar;
				nextChar = (char) input.read();
				if(nextChar<44||nextChar>122) {
					break;
				}
			}
			output.write(SNP + "\r\n");
			counter++;
			SNP = "";
			nextChar = (char) input.read();
		}
		output.close();
	}
}
