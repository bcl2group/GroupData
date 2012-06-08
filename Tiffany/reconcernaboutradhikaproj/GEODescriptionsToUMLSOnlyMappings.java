package se.src;

import gov.nih.nlm.nls.metamap.Ev;
import gov.nih.nlm.nls.metamap.Mapping;
import gov.nih.nlm.nls.metamap.MetaMapApi;
import gov.nih.nlm.nls.metamap.MetaMapApiImpl;
import gov.nih.nlm.nls.metamap.PCM;
import gov.nih.nlm.nls.metamap.Result;
import gov.nih.nlm.nls.metamap.Utterance;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

public class GEODescriptionsToUMLSOnlyMappings {

	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		MetaMapApi api = new MetaMapApiImpl();

		FileReader reader = new FileReader("GDSDescriptions.txt");
		BufferedReader in = new BufferedReader(reader);

		File gdsToUMLS = new File("GDSToSymptomsMappings.txt");

		gdsToUMLS.createNewFile();

		FileWriter out = new FileWriter(gdsToUMLS);
		
		//Uncomment this block to add options for MetaMap. List of options available at 
		//String theOptions = "-J sosy";//restricts to only semantic types Sign or Symptoms
		//api.setOptions(theOptions);
	    
		String line;
		while ((line = in.readLine()) != null) {

			int separator = line.indexOf(" ");
			String gdsID = line.substring(0, separator);
			String description = line.substring(separator + 1);
			// System.out.println(gdsID);
			// System.out.println(description);

			out.write(gdsID + "\t");
			List<Result> resultList = api
					.processCitationsFromString(description);

			for (Result result : resultList) {
				for (Utterance utterance : result.getUtteranceList()) {
					for (PCM pcm : utterance.getPCMList()) {
						for (Mapping map : pcm.getMappingList()) {
							for (Ev mapEv : map.getEvList()) {
								out.write(mapEv.getPreferredName() + " ¥ ");
							}

						}
					}
				}
			}
			out.write(System.getProperty("line.separator"));
		}
		out.close();
		in.close();
	}
}
