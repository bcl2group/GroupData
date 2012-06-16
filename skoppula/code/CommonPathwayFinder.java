import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class CommonPathwayFinder {
	public static void main(String[] args) throws IOException{
		
		//Pipeline Output Files Directory and Name
		HashMap<String, String> files = new HashMap<String, String>();
		//files.put("Boston", "C:/home/skanda/PRIMES/runs/gsea-archive/boston/output/None_alpha=0.05_GSEA-Archive.txt");
		//files.put("Michigan", "C:/home/skanda/PRIMES/runs/gsea-archive/michigan/output/None_alpha=0.05_GSEA-Archive.txt");
		//all, some, or name
		String printingOption = "mean";

		files.put("COGA", "C:/home/skanda/PRIMES/runs/coga-cogend/Run 6 - COGA - 500 Iteration/output/None_alpha=0.05_GO.txt");
		files.put("COGEND", "C:/home/skanda/PRIMES/runs/coga-cogend/Run 7 - COGEND - 500 Iteration/output/None_alpha=0.05_GO.txt");

		//files.put("Boston", "C:/home/skanda/PRIMES/runs/lung-boston-michigan/run-2-boston/output/None_alpha=0.05_GO.txt");
		//files.put("Michigan", "C:/home/skanda/PRIMES/runs/lung-boston-michigan/run-2-michigan/output/None_alpha=0.05_GO.txt");
		
		//Put files directory into an arraylist
		Iterator<Entry<String, String>> iterator = files.entrySet().iterator();
		ArrayList<String> filedirs = new ArrayList<String>();
		while(iterator.hasNext()){
			Map.Entry<String, String> pairs = (Map.Entry<String, String>)iterator.next();
			filedirs.add(pairs.getValue());
		}
		
		ArrayList<String[]> commonpathways = new ArrayList<String[]>();
		
		try {
			
			//READ FIRST DATA FILE
			BufferedReader input = new BufferedReader(new FileReader(filedirs.get(0)));
			input.readLine();
			String nextPathway = input.readLine();
			
			//iterate over each pathway in first file
			while(nextPathway!=null){
				ArrayList<String> arrayNP = new ArrayList<String>(Arrays.asList(nextPathway.split("\t")));
				boolean isCommon = true;
				
				//iterate over other files
				for(int i = 1; i<filedirs.size(); i++){
					
					boolean pathinfile = false;
					BufferedReader input2 = new BufferedReader(new FileReader(filedirs.get(i)));
					input2.readLine();
					String NP2 = input2.readLine();
					
					//iterate over each pathway in other file
					while(NP2!=null){
						String[] AP2 = NP2.split("\t");
						if(AP2[0].equals(arrayNP.get(0))){
							arrayNP.add(i+1, AP2[1]);
							arrayNP.add(arrayNP.size()-1, AP2[AP2.length-1]);
							pathinfile = true;
							
						}
						
						NP2 = input2.readLine();
					}
					
					isCommon = pathinfile&&isCommon;
					input2.close();
				}
				
				if(isCommon){
					
					//convert to String array
					String[] temp = new String[arrayNP.size()];
					for(int k = 0; k < arrayNP.size(); k++){
						temp[k] = (String) arrayNP.get(k);
					}
					
					commonpathways.add(temp);
				}
				
				nextPathway = input.readLine();
			}
			input.close();
			printOutput(printingOption, commonpathways, files.keySet());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static void printOutput(String options, ArrayList<String[]> commonpathways, Set<String> datafiles){
		

		String AUROCNameList = ""; 		//Remember, has tab on end
		Iterator<String> iterator = datafiles.iterator();
		int numdatasets = 0;
		
		while(iterator.hasNext()){
			numdatasets++;
			AUROCNameList += iterator.next()+"-AUROC\t";
		}
		
		String sigList = "";
		iterator = datafiles.iterator();
		while(iterator.hasNext()){
			sigList += iterator.next()+"-SigVal\t";
		}
		
		if(options.toLowerCase().equals("all")){
			System.out.println("Gene-Set Name\t" + AUROCNameList + "#SNPs\tGenes\tSNPs\t#Significant runs\t" + sigList);
			for(int i = 0; i < commonpathways.size(); i++){
				String line = "";
				for(int j = 0; j<commonpathways.get(i).length; j++){
					line += commonpathways.get(i)[j]+ "\t";
				}
				System.out.println(line);
			}
		} else if(options.toLowerCase().contains("mean")||options.toLowerCase().contains("average")){
			System.out.println("Gene-Set Name\t"  + "Average-AUROC" + "\tAverage-SigVal");
			for(int i = 0; i < commonpathways.size(); i++){
				String output = commonpathways.get(i)[0];
				double sum = 0;
				for(int j = 0; j < numdatasets; j++){
					sum += Double.valueOf(commonpathways.get(i)[j+1]);
				}
				output += "\t" + sum/(numdatasets + 0.0);
				sum = 0;
				for(int j = commonpathways.get(i).length-1; j > commonpathways.get(i).length-numdatasets-1; j--){
					sum += Double.valueOf(commonpathways.get(i)[j]);
				}
				output += "\t" + sum/(numdatasets + 0.0);
				System.out.println(output);
			}
		} else if(options.toLowerCase().contains("aurocs")||options.toLowerCase().contains("p-values")||options.toLowerCase().contains("some")){
			System.out.println("Gene-Set Name\t"  + AUROCNameList + sigList);
			for(int i = 0; i < commonpathways.size(); i++){
				String output = commonpathways.get(i)[0];
				for(int j = 0; j < numdatasets; j++){
					output += "\t" + commonpathways.get(i)[j+1];
				}
				for(int j = commonpathways.get(i).length-1; j > commonpathways.get(i).length-numdatasets-1; j--){
					output += "\t" + commonpathways.get(i)[j];
				}
				System.out.println(output);
			}
		} else if (options.toLowerCase().contains("name")){
			System.out.println("Gene-Set Name");
			for(int i = 0; i < commonpathways.size(); i++){
				System.out.println(commonpathways.get(i)[0]);
			}
		} else {
			System.out.println("Option not understood");
		}
	}
	
	public static <T, E> T getKeyByValue(Map<T, E> map, E value) { 
	    for (Entry<T, E> entry : map.entrySet()) { 
	        if (value.equals(entry.getValue())) { 
	            return entry.getKey(); 
	        } 
	    } 
	    return null; 
	} 
}
