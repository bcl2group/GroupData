import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.StringTokenizer;

public class MeSHTermsSymptomsFilter {
	
	public static void main(String[] args) throws IOException {
		
		// Reads the file that contains the GEO IDs mapped to UMLS concepts and MeSH terms
		FileReader fileReader = new FileReader("GDSIDsUMLSMESH.txt");
		
		BufferedReader geoPubmedMesh = new BufferedReader(fileReader);
		
		// Reads the file that contains a list of symptoms
		FileReader fileReader2 = new FileReader("symptoms.txt");
		BufferedReader diseaseList = new BufferedReader(fileReader2);
		
		// A hash map that will map each symptom term to an array list
		// containing GEO IDs
		HashMap<String, ArrayList<String>> symptomsToGeoIDs = new HashMap<String, ArrayList<String>>();
		
		// A hash map that will map each GEO ID to its symptom terms
		HashMap<String, ArrayList<String>> GEOIDsToSymptoms = new HashMap<String, ArrayList<String>>();
		
		// Adds each disease term mapped to a blank array list to the hash map
		String symptomLine = null;
		while ((symptomLine = diseaseList.readLine()) != null) {
			ArrayList<String> blank = new ArrayList<String>();
			symptomsToGeoIDs.put(symptomLine, blank);
			
		}
		// An array that will contain all of the symptoms
		
		String[] symptoms = new String[symptomsToGeoIDs.keySet().size()];
		
		// Adds all the symptom names to the list of symptoms
		int index = 0;
		for (String d : symptomsToGeoIDs.keySet()) {
			symptoms[index] = d;
			
			index++;
			
		}
		
		
		// Goes through each line of the GEOIDs -> UMLS+MeSH file
		// to find the
		// GEO IDs associated with each symptom
		String geoPubmedMeshLine = null;
		int count = 0;
		while ((geoPubmedMeshLine = geoPubmedMesh.readLine()) != null) {
			String geoID = getIdFromLine(geoPubmedMeshLine, 1);
			String meshTerms = getIdFromLine(geoPubmedMeshLine, 2);
			// A boolean that keeps track of whether this geoID has an
			// associated symptom term
			Boolean symptomFound = false;
			
			// An array list that keeps track of this geo ID's disease terms
			ArrayList<String> thisGEOIDsSymptoms = new ArrayList<String>();
			
			// Goes through each symptom term and checks to see if it is in the
			// MeSH terms/UMLS concept
			// then adds the GEO ID to the appropriate array list in the hash
			// map
			
			String[] meshTermsArray = meshTerms.split(" ¥ ");
			for (String d : symptoms) {
				for (String term : meshTermsArray) {
					// System.out.println(term);
					{
						if (term.equals(d)) {
							//System.out.println(d);
							//System.out.println(term);
							ArrayList<String> g = symptomsToGeoIDs.get(d);
							g.add(geoID);
							thisGEOIDsSymptoms.add(d);
							symptomFound = true;
							count++;
							break;
						}
					}
				}
			}
			// Adds this GEO ID and its symptom terms to the hash map
			GEOIDsToSymptoms.put(geoID, thisGEOIDsSymptoms);
			
		}
		System.out.println(count);
		// Creates a new file that lists each symptom term and its
		// associated
		// GEO IDs
		File f = new File("symptomsToGDSIDs.txt");
		f.createNewFile();
		FileWriter out = new FileWriter(f);
		
		// Writes the results to the file
		for (String d : symptomsToGeoIDs.keySet()) {
			
			// Creates a string that is a separated list of the GEO IDs
			String GEOIDs = "";
			if (symptomsToGeoIDs.get(d).size() > 0) {
				for (int i = 0; i < symptomsToGeoIDs.get(d).size() - 1; i++) {
					GEOIDs = GEOIDs + symptomsToGeoIDs.get(d).get(i) + ",";
				}
				GEOIDs = GEOIDs
				+ symptomsToGeoIDs.get(d).get(
											  symptomsToGeoIDs.get(d).size() - 1);
			}
			
			out.write(d + "\t" + GEOIDs);
			out.write(System.getProperty("line.separator"));
		}
		
		// Creates a new file that lists each GEO IDs and its associated
		// symptom term
		File f3 = new File("GDSIDstoSymptoms.txt");
		f3.createNewFile();
		FileWriter out3 = new FileWriter(f3);
		
		for (String g : GEOIDsToSymptoms.keySet()) {
			String symptomTerms = "";
			if (GEOIDsToSymptoms.get(g).size() > 0) {
				for (int i = 0; i < GEOIDsToSymptoms.get(g).size() - 1; i++) {
					symptomTerms = symptomTerms
					+ GEOIDsToSymptoms.get(g).get(i) + " ¥ ";
				}
				symptomTerms = symptomTerms
				+ GEOIDsToSymptoms.get(g).get(
											  GEOIDsToSymptoms.get(g).size() - 1);
			}
			
			out3.write(g + "\t" + symptomTerms);
			out3.write(System.getProperty("line.separator"));
		}
		
		out.close();
		out3.close();
		
	}
	
	// Supplementary method
	// Given a line and a number, will return that token from the line
	// (delimited by tabs)
	private static String getIdFromLine(String line, int num) {
		StringTokenizer st = new StringTokenizer(line, "\t");
		for (int i = 1; i < num; i++) {
			st.nextToken();
		}
		return st.nextToken();
	}
	
}