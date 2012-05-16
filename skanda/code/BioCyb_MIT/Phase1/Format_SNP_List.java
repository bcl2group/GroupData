import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Puts the SNPs into columns from a list on one row
 * 
 * @author Skanda Koppula
 * @version 2.24.2011
**/

public class Format_SNP_List {
	
	public static void main(String[] args) throws IOException{
		
		final String SNPLISTPATH = "C:/home/skanda/PRIMES/data/coga-sync-complete-SNPlist.csv";
		final String OUTPUTFILE = "C:/home/skanda/PRIMES/data/coga-sync-complete-SNPlist.wr";
		
		BufferedReader input = new BufferedReader(new FileReader(SNPLISTPATH));

		//Create Fresh Output File
		FileWriter output = new FileWriter(OUTPUTFILE);
		output = new FileWriter(OUTPUTFILE, true);
		String SNP = "";
		
		char nextChar = (char) input.read();
		while(nextChar>33&&nextChar<122){
			while(nextChar!=44){
				SNP+=nextChar;
				nextChar = (char) input.read();
				if(nextChar<44||nextChar>122) {
					break;
				}
			}
			output.write(SNP + "\r\n");
			SNP = "";
			nextChar = (char) input.read();
		}
		output.close();
	}
}