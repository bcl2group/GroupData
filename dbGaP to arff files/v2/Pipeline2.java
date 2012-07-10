import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Properties;

/**
 * @author Skanda Koppula
 * 
 * @param properties path of the properties file for the pipeline
 * @param numGigs the amount of memory the program should allocate for the pipeline
 * 			example: 	1g			for one gigabyte
 * 						2g
 * @param java-path where Java is installed
 *
 * Please note that this class simply executes the pipeline (pipeline-src.jar) 
 * with an pre execution extension to simply input text files with a gene or 
 * SNP list to perform the Fisher Exact Test (into train and trainFull). It also
 * can now create the SNP annotation file via our own simple-SNP-annotation.jar.
 * 
 * @date June 21, 2012
 */

public class Pipeline2 {
	
	public static void main(String[] args) throws IOException {
		
		boolean testing = false;
		String propertiesFileDir = testing ? "properties.txt" : args[0];
		
		try{	
			
			System.out.println("Reading properties file...");
			Properties props = new Properties();
			FileInputStream in = new FileInputStream(propertiesFileDir);
			props.load(in);
			in.close();
			
			System.out.println("Still reading...\n");
			boolean isSNPData = props.getProperty("isSNPData", "n").toLowerCase().contains("y");
			String train = props.getProperty("train", null);
			String trainFull = props.getProperty("trainFull", null);
			String arffTrain = null, arffTrainFull = null;
			
			System.out.println("Checking to see if conversion to .ARFF is necessary...");
			if(train!=null&&train.toLowerCase().contains(".txt")){
				arffTrain = convertToARFF(train, isSNPData);
				props.remove("train");
				props.put("train", arffTrain);
				writePropsToFile(props, args[0]);
			}
			
			if(trainFull!=null&&trainFull.toLowerCase().contains(".txt")){
				arffTrainFull = convertToARFF(trainFull, isSNPData);
				props.remove("trainFull");
				props.put("trainFull", arffTrainFull);
				writePropsToFile(props, args[0]);
			}
			
			System.out.println("Checking to see if need to do SNP annotation...");
			String snpToGenes = props.getProperty("snpToGenes", "snp-annotation.csv");
			String totalList = props.getProperty("totalSNPList", "merged.txt");
			String javaLoc = props.getProperty("javaLoc", "java");
			String memory = props.getProperty("memory", "1g");
			boolean calculateFisher = props.getProperty("calculateFisher", "n").toLowerCase().contains("y");
			boolean doSNPAnnotation = props.getProperty("doSNPAnnotation", "n").toLowerCase().contains("y");
			int geneSpan = Integer.parseInt(props.getProperty("geneSpan", "500000"));
			int exonSpan = Integer.parseInt(props.getProperty("geneSpan", "3000"));
			boolean header = props.getProperty("header", "n").toLowerCase().contains("y");
			
			//update gene index
			if(doSNPAnnotation==false){
				System.out.println("Not doing SNP annotation...using " + snpToGenes);
			} else {
				System.out.println("Doing SNP annotation...assuming list of SNPs as text files are present...");
				mergeFiles(totalList, train, trainFull);
				
				ProcessBuilder pb = new ProcessBuilder(javaLoc, "-XX:+UseConcMarkSweepGC", "-Xmx" + memory, "-jar", "simple-SNP-annotation.jar", totalList, geneSpan + "", exonSpan + "", snpToGenes, header + "");
				pb.directory(new File("./"));
				Process p = pb.start();
				InputStream inputStream = p.getInputStream();
			    int c = 0;
			    while ((c = inputStream.read()) != -1) {
			       System.out.print((char)c);
			    }
			    inputStream.close();
			    
			    //Update gene and distance index
				props.put("geneIndex", 8);
				props.put("distanceIndex", 9);
				writePropsToFile(props, args[0]);
			}
			
			//DUPLICATE BACKGROUND MODEL AS RANDOM MAP if Fisher!!!
			if(calculateFisher){
				props.put("backgroundModel", snpToGenes);
				writePropsToFile(props, args[0]);
			}
			
			runPipeline(args[0]);
			System.out.println("Done!");
			
		} catch(Exception e){
			System.out.println("Note: Errors were printed out to pipeline_error_log.txt");
			PrintStream newErr = new PrintStream("pipeline_error_log.txt");
			System.setErr(newErr);
			e.printStackTrace();
		}
	}
	
	public static void mergeFiles(String fileName, String f1, String f2){
		try {
			System.out.println("Merging list of SNPs and saving merged lists to: " + fileName);
			
			BufferedWriter outFile = new BufferedWriter(new FileWriter(fileName));
			BufferedReader in = new BufferedReader(new FileReader(f1));
			BufferedReader in2 = new BufferedReader(new FileReader(f2));
			
			String str;
			while ((str = in.readLine()) != null)
				outFile.write(str + "\n");
			in.close();
			
			while ((str = in2.readLine()) != null)
				outFile.write(str + "\n");
			in2.close();			
			
			outFile.close();
			System.out.println("Done merging.");
			
		} catch (IOException e) {}
	}
	
	public static void writePropsToFile(Properties props, String propFileName){
		System.out.println("Writing updated properties file...");
		
		String output = props.toString();
		output = output.substring(1, output.length()-1);
		output = output.replaceAll(", ", "\n");
		
		try {
			FileWriter fw = new FileWriter(propFileName);
			fw.write(output);
			fw.close();
		} catch (IOException e) {
			System.out.println("Error: cannot write file.");
		}
	}
	
	public static String convertToARFF(String fileName, boolean isSNPData) throws IOException{
		
		System.out.println("Taking " + fileName + " as .txt and converting it to .ARFF ...\n");
		String arffFile = fileName.substring(0,fileName.length()-3)+"arff";
		
		FileWriter output = new FileWriter(arffFile);
		output = new FileWriter(arffFile, true);
		
		BufferedReader inputGeneList = new BufferedReader(new FileReader(fileName));
		String s2 = inputGeneList.readLine();
		
		output.write("@relation " + fileName + "\n\n");
		
		if(isSNPData){
			while(s2!=null){
				output.write("@attribute " + s2 + " {0N,1N}\n");
				s2 = inputGeneList.readLine();
			}
			
		} else {
			while(s2!=null){
				output.write("@attribute " + s2 + " numeric\n");
				s2 = inputGeneList.readLine();
			}
		}
		
		output.write("\n" + "@data");
		output.close();
		
		return arffFile;
	}
	
	public static void runPipeline(String propsDir) throws IOException{
		System.out.println("Submitting pipeline request and reading properties file for memory and java location settings...");		
		Properties props = new Properties();
		FileInputStream in = new FileInputStream(propsDir);
		props.load(in);
		in.close();
		
		String javaLoc = props.getProperty("javaLoc", "java");
		String memory = props.getProperty("memory", "1g");
		
		ProcessBuilder pb = new ProcessBuilder(javaLoc, "-XX:+UseConcMarkSweepGC", "-Xmx" + memory, "-jar", "pipeline-src.jar", propsDir);
		pb.directory(new File("./"));
		Process p = pb.start();
		
		InputStream inputStream = p.getInputStream();
	    int c = 0;
	    while ((c = inputStream.read()) != -1) {
	       System.out.print((char)c);
	    }
	    
	    inputStream.close();
	}

}
