import weka.core.converters.ArffSaver;
import weka.core.Instances;
import weka.classifiers.bayes.*;
import weka.classifiers.*;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Discretize;
import weka.filters.unsupervised.attribute.NumericToBinary;
import weka.filters.supervised.attribute.AttributeSelection;
import weka.attributeSelection.GreedyStepwise;
import weka.attributeSelection.Ranker;
import weka.attributeSelection.GainRatioAttributeEval;
import weka.attributeSelection.CfsSubsetEval;
//import weka.attributeSelection.AttributeSelection;
import java.io.*;
import multinet.*;
import weka.classifiers.Evaluation;
import java.util.*;


public class attribute_selector_ranker{
	public static void main(String[] args) throws Exception {
		int num_attr = Integer.parseInt(args[0]);
/*
		String disease = "Adenocarcinoma";
		String experiment = "GDS3384";
		String type = "single";
*/
		String disease = args[1];
		System.out.println("disease ---> " + disease);
		String experiment = args[2];
		System.out.println("experiment ---> " + experiment);
		String type = args[3];
		System.out.println("type ---> " + type);
		String threshold = args[4];


		String data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/train/"+type+"/"+threshold+"/";
		String test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/test/"+type+"/"+threshold+"/";



/*
		String data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/sandbox/train/";
		String test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/sandbox/test/";
*/

		//String test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/test/single/"+threshold+"/";
		//String data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/";
		//String test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/";

		//String data_file = "GDS2381_Dermatitis_Atopic_training_single_split_singlenet_threshold_90_10percent.arff";
/*
		String data_file = experiment+"_"+disease+"_training_"+type+"_split_singlenet_threshold_"+threshold+"_10percent.txt";
		String test_data_file = experiment+"_"+disease+"_testing_single_split_singlenet_threshold_"+threshold+"_10percent.txt";
*/

		String data_file = "HS_" + disease + "_" + experiment+"_" + type + "_" +threshold+"_train.arff";
		String test_data_file = "HS_" + disease + "_" + experiment+"_" + type + "_" +threshold+"_test.arff";
//		String data_file = disease + "_" + experiment+"_" + type + "_" +threshold+"_train.arff";
//		String test_data_file = disease + "_" + experiment+"_" + type + "_" +threshold+"_test.arff";

		//String data_file = experiment+"_training_data_GDS3384_remove_adenocarcinoma_"+threshold+"_percent.arff";
		//String test_data_file = experiment+"_testing_data_GDS3384_remove_adenocarcinoma_"+threshold+"_percent.arff";
/*
		String data_file = "training_data_samples_"+threshold+".arff";
		String test_data_file = "testing_data_samples_"+threshold+".arff";
*/

		//String data_file = "GDS3384_remove_Adenocarcinoma_training_multi_split_3257_singlenet_threshold_66_10percent.arff";
		//String test_data_file = "GDS3257_testing_data_GDS3384_remove_adenocarcinoma.arff";
		//String data_file = "GDS3257_training_data_GDS2966_remove_GDS3101_remove_lung_neoplasm_threshold_66.arff";
		//String test_data_file = "GDS3257_testing_data_GDS2966_remove_GDS3101_remove_lung_neoplasm_threshold_66.arff";

//		String data_file = experiment+"_remove_GDS3101_remove_"+disease+"_training_"+type+"_split_singlenet_threshold_0_10percent.arff";
		//String data_file = experiment+"_remove_GDS2087_remove_"+disease+"_training_"+type+"_split_singlenet_threshold_0_10percent.txt";

		
        	BufferedReader reader = new BufferedReader(new FileReader(data_directory + data_file));
        	BufferedReader test_reader = new BufferedReader(new FileReader(test_data_directory + test_data_file));
		
/*
        	BufferedReader reader = new BufferedReader(new FileReader(data_file));
        	BufferedReader test_reader = new BufferedReader(new FileReader(test_data_file));
*/
        	Instances data = new Instances(reader);
        	Instances test_data = new Instances(test_reader);
        	data.setClassIndex(0);
        	test_data.setClassIndex(0);
        	reader.close();
        	test_reader.close();
		System.out.println("closed the readers");
//		System.out.println("about to create filter");
		AttributeSelection filter = new AttributeSelection();
//		System.out.println("about to create gain ratio attribute eval");
		//CfsSubsetEval eval = new CfsSubsetEval();
		GainRatioAttributeEval eval = new GainRatioAttributeEval();
//		System.out.println("about to create greedy stepwise search");
		//GreedyStepwise search = new GreedyStepwise();
		Ranker search = new Ranker();
//		System.out.println("about to create greedy stepwise search");
		search.setGenerateRanking(true);
//		search.setSearchBackwards(false);
		search.setNumToSelect(num_attr);
//		System.out.println("num to select ---> " + search.getNumToSelect());
//		System.out.println("generate ranking ---> " + search.getGenerateRanking());
//		System.out.println("string info ---> " + search.toString());
		filter.setEvaluator(eval);
		filter.setSearch(search);
		filter.setInputFormat(data);
		Instances newData = Filter.useFilter(data, filter);
		Instances newTestData = Filter.useFilter(test_data, filter);
		newData.setClassIndex(0);
		newTestData.setClassIndex(0);

		NumericToBinary ntb = new NumericToBinary();
		ntb.setInputFormat(newData);
		Instances binarized_newData = Filter.useFilter(newData, ntb);
		Instances binarized_newTestData = Filter.useFilter(newTestData, ntb);
		binarized_newData.setClassIndex(binarized_newData.numAttributes() - 1);
		binarized_newTestData.setClassIndex(binarized_newTestData.numAttributes() - 1);
/*
		binarized_newData.setClassIndex(0);
		binarized_newTestData.setClassIndex(0);
*/
		
//		System.out.println("ranked attributes ---> " + search.rankedAttributes());
//		System.out.println(newData);
//		System.out.println("finished all but writing");
		//String train_file_save = "/scratch/vinnie/multinet/multinet/attributes_testing/"+disease+"_"+type+"/"+experiment+"_remove_GDS3101_remove_"+type+"_"+num_attr+"_attr.arff";	
/*
		String train_file_save = "/scratch/vinnie/multinet/multinet/attributes_testing_MM/"+"test_"+disease+"_"+type+"/train/"+experiment+"_"+threshold+"_"+type+"_"+num_attr+"_attr_train.arff";	
		String test_file_save = "/scratch/vinnie/multinet/multinet/attributes_testing_MM/"+"test_"+disease+"_"+type+"/test/"+experiment+"_"+threshold+"_"+type+"_"+num_attr+"_attr_test.arff";	
*/
		String train_file_save = "/scratch/vinnie/multinet/multinet/attributes_testing/"+disease+"_"+type+"/train/"+experiment+"_"+threshold+"_"+type+"_"+num_attr+"_attr_train.arff";	
		String test_file_save = "/scratch/vinnie/multinet/multinet/attributes_testing/"+disease+"_"+type+"/test/"+experiment+"_"+threshold+"_"+type+"_"+num_attr+"_attr_test.arff";	
//		System.out.println(train_file_save);
		ArffSaver saver_train = new ArffSaver();
		ArffSaver saver_test = new ArffSaver();

		//saver_train.setInstances(newData);
		saver_train.setInstances(binarized_newData);
		saver_train.setFile(new File(train_file_save));
		saver_train.writeBatch();

		//saver_test.setInstances(newTestData);
		saver_test.setInstances(binarized_newTestData);
		saver_test.setFile(new File(test_file_save));
		saver_test.writeBatch();



		Classifier bayes2 = new BayesNet();
        	String[] bayesOptions = new String[2];
	        bayesOptions[0] = "-Q";
       	 	//bayesOptions[1] = "weka.classifiers.bayes.net.search.local.K2";
       	 	bayesOptions[1] = "weka.classifiers.bayes.net.search.local.TAN";
       	 	bayes2.setOptions(bayesOptions);

		Evaluation evaluation = new Evaluation(binarized_newData);
		//Evaluation evaluation = new Evaluation(train_file_save);
		
		System.out.println("about to evaluate model");
		String[] evaluate_options = new String[4];
		evaluate_options[0] = "-t"; 
		evaluate_options[1] = train_file_save; 
		evaluate_options[2] = "-T"; 
		evaluate_options[3] = test_file_save; 
		
		//evaluation.evaluateModel(bayes2, test_file_save);
		//evaluation.evaluateModel(bayes2, binarized_newTestData);
		//String evaluation_string = Evaluation.evaluateModel(bayes2, evaluate_options);

		String evaluation_string = evaluation.evaluateModel(bayes2, evaluate_options);
		//evaluation.evaluateModel(bayes2, evaluate_options);
		System.out.println("evaluated model");
		System.out.println("test instances:");
		System.out.println(binarized_newTestData.numInstances());
		System.out.println("total instances:");
		System.out.println(binarized_newTestData.numInstances() + binarized_newData.numInstances());
		

		System.out.println(evaluation_string);

	        System.out.println("Weighted area under ROC: ");
       		System.out.println(evaluation.weightedAreaUnderROC());
        
       		// compare negative and positive accuracy rates
	        System.out.println("True negative (control): ");
	        System.out.println(evaluation.falsePositiveRate(0)); // true negative (control)
	        System.out.println("True positive: ");
	        System.out.println(evaluation.falsePositiveRate(1)); // true positive



		//create a bayes classifier
/*
		newData.setClassIndex(0);
        	Classifier bayes = new BayesNet();
	        String[] bayesOptions = new String[2];
       	 	bayesOptions[0] = "-Q";
	        bayesOptions[1] = "weka.classifiers.bayes.net.search.local.K2";
        	bayes.setOptions(bayesOptions);
        	Classifier bayes2 = new BayesNet();
        	Evaluation evaluation = new Evaluation(newData);

		String[] evaluate_options = new String[4];
		evaluate_options[0] = "-split-percentage"; 
		evaluate_options[1] = 75; 
		//do different splits
*/
	}

}
