import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class ReducingDataset {
	
	public static void main(String[] args) throws IOException{
		
		final String INPUTPATH = "C:/home/skanda/PRIMES/data/coga005.arff";
		final String OUTPUTPATH = "C:/home/skanda/PRIMES/data/coga-superreduced.arff";
		final int numSNPS = 20;
		final int numPats = 501;
		
		BufferedReader input = new BufferedReader(new FileReader(INPUTPATH));
		FileWriter output = new FileWriter(OUTPUTPATH);
		output = new FileWriter(OUTPUTPATH, true);
		
		//write @relation name
		String nextline = input.readLine();
		output.write(nextline + "\n");
		
		for(int i = 0; i < numSNPS; i ++){
			output.write(input.readLine() + "\n");
		}
		
		nextline = input.readLine();
		
		while(!(nextline.contains("sex"))){
			nextline = input.readLine();
		}
		
		//sex
		output.write(nextline + "\n");
		
		//race
		nextline = input.readLine();
		output.write(nextline + "\n");
		
		//phenotype
		nextline = input.readLine();
		output.write(nextline + "\n\n");
		
		//space and @data
		nextline = input.readLine();
		nextline = input.readLine();
		output.write(nextline + "\n");
		
		nextline = input.readLine();
		
		for(int i = 0; i < numPats; i++){
		//while(nextline!=null){
			String[] parts = nextline.substring(0, numSNPS*3).split(",");
			
			String first = "";
			for(int j = 0; j < numSNPS; j++){
				first += parts[j] + ",";
			}
			
			output.write(first +  nextline.substring(nextline.length()-11) + "\n");
			nextline = input.readLine();
		}
		output.close();
	}
}