import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;


public class ICD10SymptomsGetter {
	public static void main(String[] args){
		FileReader fileReader;
		try {
			
			//Text file of codes downloaded from http://www.who.int/classifications/icd/en/
			fileReader = new FileReader("codes.txt");
			BufferedReader in = new BufferedReader(fileReader);
			File symptoms = new File("symptoms.txt");
			symptoms.createNewFile();
			FileWriter out = new FileWriter(symptoms);
			
			String code;
			while ((code = in.readLine()) != null) {

				String[] codeComponents=code.split(";");
				
				if (codeComponents[1].equals("T")){ //"T" indicates it is a terminal i.e. leaf node -> symptom
					//System.out.println(codeComponents[8]);
					out.write(codeComponents[8]);
					out.write(System.getProperty("line.separator"));				
				}
			}
			out.close();
			in.close();
			fileReader.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}
}
