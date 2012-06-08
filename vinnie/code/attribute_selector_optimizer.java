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


public class attribute_selector_optimizer{
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


		String data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/train/single/"+threshold+"/";
		String test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/test/single/"+threshold+"/";
		String multi_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/train/multi/"+threshold+"/";
		String multi_test_data_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/"+disease+"_binarize/"+experiment+"/test/multi/"+threshold+"/";


		String data_file = "HS_" + disease + "_" + experiment+"_single_" +threshold+"_train.arff";
		String test_data_file = "HS_" + disease + "_" + experiment+"_single_" +threshold+"_test.arff";

		String multi_data_file = "HS_" + disease + "_" + experiment+"_multi_" +threshold+"_train.arff";
		String multi_test_data_file = "HS_" + disease + "_" + experiment+"_multi_" +threshold+"_test.arff";

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

        	BufferedReader multi_reader = new BufferedReader(new FileReader(multi_data_directory + multi_data_file));
        	BufferedReader multi_test_reader = new BufferedReader(new FileReader(multi_test_data_directory + multi_test_data_file));
		
/*
        	BufferedReader reader = new BufferedReader(new FileReader(data_file));
        	BufferedReader test_reader = new BufferedReader(new FileReader(test_data_file));
*/
        	Instances data = new Instances(reader);
        	Instances test_data = new Instances(test_reader);

        	Instances multi_data = new Instances(multi_reader);
        	Instances multi_test_data = new Instances(multi_test_reader);

        	data.setClassIndex(0);
        	test_data.setClassIndex(0);

        	multi_data.setClassIndex(0);
        	multi_test_data.setClassIndex(0);

        	reader.close();
        	test_reader.close();

        	multi_reader.close();
        	multi_test_reader.close();

		System.out.println("closed the readers");


		AttributeSelection filter = new AttributeSelection();
		GainRatioAttributeEval eval = new GainRatioAttributeEval();

		AttributeSelection multi_filter = new AttributeSelection();
		GainRatioAttributeEval multi_eval = new GainRatioAttributeEval();

		Ranker search = new Ranker();
		Ranker multi_search = new Ranker();

		search.setGenerateRanking(true);
		multi_search.setGenerateRanking(true);


//		search.setNumToSelect(num_attr);
		multi_search.setNumToSelect(num_attr);

		filter.setEvaluator(eval);
		filter.setSearch(search);
		filter.setInputFormat(data);
		Instances newData = Filter.useFilter(data, filter);
		Instances newTestData = Filter.useFilter(test_data, filter);
		newData.setClassIndex(0);
		newTestData.setClassIndex(0);

		multi_filter.setEvaluator(multi_eval);
		multi_filter.setSearch(multi_search);
		multi_filter.setInputFormat(multi_data);
		Instances multi_newData = Filter.useFilter(multi_data, multi_filter);
		Instances multi_newTestData = Filter.useFilter(multi_test_data, multi_filter);
		multi_newData.setClassIndex(0);
		multi_newTestData.setClassIndex(0);

		System.out.println(" number of original single attributes ");
		System.out.println(data.numAttributes());
		
		int[] new_order_list = new int[multi_data.numAttributes()];
		HashMap attribute_weight_dict = new HashMap();

		System.out.println(" -------- ");
		System.out.println("--- single non ranked attributes ---");
		for(int i=0; i < 5; i++){
			System.out.println(data.attribute(i));	
		}

		System.out.println(" -------- ");
		System.out.println("--- single ranked attributes ---");
		// weight the single rankings //
		int multi_sort_list_counter = 0;
		for(int i=0; i < newData.numAttributes(); i++){
			String current_attribute = newData.attribute(i).name();
			System.out.println(newData.attribute(i));	
			attribute_weight_dict.put(current_attribute, i);
			//if this attribute is in multi_attributes
			//add it to sorted multi_attr list
			if (multi_newData.attribute(current_attribute) != null){
				System.out.println("not null!");
				System.out.println("current attribute ---> " + current_attribute);
				System.out.println("index ---> " + i);
				int multi_index = multi_newData.attribute(current_attribute).index();
				System.out.println("multi index ---> " + multi_index);
				new_order_list[multi_sort_list_counter] = multi_index;	
				multi_sort_list_counter++;
				
			}
		}

		System.out.println("--- new order list ---");
		for(int i=0; i < multi_data.numAttributes(); i++){
			System.out.println(new_order_list[i]);
//			System.out.println([i]);
			
		}
		System.out.println("-------------------");
		


		System.out.println("--- multi non ranked attributes ---");
		for(int i=0; i < 5; i++){
			String current_attribute = multi_data.attribute(i).name();
			System.out.println(multi_data.attribute(i));	
			System.out.println("weight ---> " + attribute_weight_dict.get(current_attribute));
			System.out.println("");
		}

		System.out.println(" -------- ");
		System.out.println("--- multi ranked attributes ---");
		for(int i=0; i < 5; i++){
			System.out.println(multi_newData.attribute(i));	
		}


/*
		double[][] multi_ranked_attributes = multi_search.rankedAttributes();
		System.out.println("--- multi ranked attributes ---");
		System.out.println(multi_ranked_attributes);
*/

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
       	 	bayesOptions[1] = "weka.classifiers.bayes.net.search.local.K2";
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
