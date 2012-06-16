import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

public class OntologySizeCount {
	public static void main(String[] args) throws IOException{
		
		final String[] INPUTPATHS = {"C:/home/skanda/PRIMES/data/c2.cp.kegg.v3.0.symbols.gmt", "C:/home/skanda/PRIMES/data/c5.bp.v3.0.symbols.gmt"};
		
		
		
		for(int i = 0; i < INPUTPATHS.length; i++){
			String filename = INPUTPATHS[i];
			BufferedReader input = new BufferedReader(new FileReader(filename));
		
			HashMap<Integer, Integer> count = new HashMap<Integer, Integer>();
			
			String ontology = input.readLine();
			while(ontology!=null){
				int size = 0;
				size = ontology.split("\t").length - 2;
				if(!count.containsKey(size))
					count.put(size, 1);
				else
					count.put(size,(count.get(size)+1));
				
				ontology = input.readLine();
			}
			
			TreeMap<Integer, Integer> sortedMap = new TreeMap<Integer, Integer>(count);
			
			printHashMap(filename, sortedMap);
			System.out.println();
		}
	}
	
	public static void printHashMap(String nameOfHashMap, Map<Integer, Integer> count){
		System.out.println(nameOfHashMap);
		for (int key : count.keySet()){
		    System.out.println(key + " " + count.get(key));
		}
	}
}
