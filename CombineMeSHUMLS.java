import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.StringTokenizer;

public class CombineMeSHUMLS {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		FileReader fileReader;
		try {
			fileReader = new FileReader("GDSToUMLSMappings.txt");
			//fileReader = new FileReader("GDSToUMLSCandidates.txt");
			BufferedReader gdsToUMLS = new BufferedReader(fileReader);

			// Reads the file that contains a list of symtpoms
			FileReader fileReader2 = new FileReader("GDSPubmedMeSH.txt");
			BufferedReader geoPubmedMesh = new BufferedReader(fileReader2);

			// A hash map that will map each disease term to an array list
			// containing GEO IDs
			HashMap<String, String> GEOIDsToUMLS = new HashMap<String, String>();

			// A hash map that will map each GEO ID to its disease terms
			HashMap<String, String> GEOIDsToMesh = new HashMap<String, String>();

			String umlsLine = null;
			String meshLine = null;

			while ((umlsLine = gdsToUMLS.readLine()) != null) {
				// ArrayList<String> blank = new ArrayList<String>();
				String geoID = getIdFromLine(umlsLine, 1);
				String umlsConcepts = getIdFromLine(umlsLine, 2);
				GEOIDsToUMLS.put(geoID, umlsConcepts);
				
			}
			while ((meshLine = geoPubmedMesh.readLine()) != null) {
				// ArrayList<String> blank = new ArrayList<String>();
				String geoID = getIdFromLine(meshLine, 1);
				String meshTerms = getIdFromLine(meshLine, 3);
				GEOIDsToMesh.put(geoID, meshTerms);
				

			}
			File f = new File("GDSIDsUMLSMESH.txt");
			f.createNewFile();
			FileWriter out = new FileWriter(f);

			for (String gds : GEOIDsToUMLS.keySet()) {
				String meshTerms = GEOIDsToMesh.get(gds);
				String umls = GEOIDsToUMLS.get(gds);
				out.write(gds + "\t");
				out.write(umls + meshTerms + "\n");
			}

			out.close();
			geoPubmedMesh.close();
			gdsToUMLS.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private static String getIdFromLine(String line, int num) {
		StringTokenizer st = new StringTokenizer(line, "\t");
		for (int i = 1; i < num; i++) {
			st.nextToken();
		}
		return st.nextToken();
	}

}
