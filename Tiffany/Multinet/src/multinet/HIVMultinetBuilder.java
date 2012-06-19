/*
 * Author: Albert Wu
 * Date: 7/5/2011
 * 
 * Creates a multinet using data merged from experiments
 * To run this with NetBeans move all the text files from this folder to the folder
 *      with the build.xml file.
 * 
 */
package multinet;

import weka.core.Instances;
import weka.classifiers.bayes.*;
import weka.classifiers.*;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Discretize;
import java.io.*;
import multinet.*;
import weka.classifiers.Evaluation;
import java.util.*;

public class HIVMultinetBuilder {
    
    // change to either build a simple Bayesian network or Bayesian multinet
    public static void main(String[] args) throws Exception {
        /* run buildBayes to build simple Bayesian classifier
           run buildMultinet to build Multinet classifier */

    	System.out.println("starting");
        String filename = "Huntington_15percent.txt";
        String filenameOut = "Huntington_15percent_output.txt";
        
        buildMultinet(filename, filenameOut);
        
        System.out.println("done");
    }

    /* create simple Bayesian network (TAN) */
    public static void buildBayes(String filename_singlenet, String output_filename) throws Exception {
        
        /* read in ARFF */
        BufferedReader reader = new BufferedReader(new FileReader(filename_singlenet));
        Instances data = new Instances(reader);
        reader.close();
        data.setClassIndex(0);
        
        FileWriter output = new FileWriter(output_filename);
        
        // discretize data to 50 bins
        String[] options = new String[2];
        options[0] = "-B";
        options[1] = "50";                
        Discretize dis = new Discretize();
        dis.setOptions(options);                         
        dis.setInputFormat(data);  
        Instances newData = Filter.useFilter(data, dis);
        newData.setClassIndex(0);
        
        /* create Bayesian network classifier */
        Classifier bayes = new BayesNet();
        String[] bayesOptions = new String[2];
        bayesOptions[0] = "-Q";
        bayesOptions[1] = "weka.classifiers.bayes.net.search.local.K2";
        bayes.setOptions(bayesOptions);
        bayes.buildClassifier(newData);
        
        //newData.setClassIndex(0);
        output.write(bayes.toString());
        output.write("\n");
        
        /* cross-validation of Bayesian network */
        Classifier bayes2 = new BayesNet();
        Evaluation evaluation = new Evaluation(newData);
        
        evaluation.crossValidateModel(bayes2, newData, 10, new Random(1));
        output.write(evaluation.toSummaryString());
        output.write("\n");
        output.write("Weighted area under ROC: ");
        output.write(Double.toString(evaluation.weightedAreaUnderROC()));
        output.write("\n");
        
        // compare negative and positive accuracy rates
        output.write("True negative (control): ");
        output.write(Double.toString(evaluation.falsePositiveRate(0))); // true negative (control)
        output.write("\n");
        output.write("True positive: ");
        output.write(Double.toString(evaluation.falsePositiveRate(1))); // true positive
        
        output.close();
    }
    
    /* creates Multinet */
    public static void buildMultinet(String filename, String output_filename) throws Exception {
        // read in ARFF file
        BufferedReader reader = new BufferedReader(new FileReader(filename));
        
        // Create a new filewriter
        FileWriter output = new FileWriter(output_filename);
        
        Instances data = new Instances(reader);
        reader.close();
        
        // classes are in the first file
        data.setClassIndex(0);
        
        // discretize data to 100 bins
        String[] options = new String[2];
        options[0] = "-B";
        options[1] = "50";                                
        Discretize dis = new Discretize();           
        dis.setOptions(options);                         
        dis.setInputFormat(data);  
        Instances newData = Filter.useFilter(data, dis);
        newData.setClassIndex(0);
        
        // build multinet using Kent's BayesMultiNetTAN class
        BayesMultiNetTAN multinet = new BayesMultiNetTAN();
        multinet.buildClassifier(newData);
        output.write("Multinet");
        output.write("\n");
        output.write(multinet.toString());
        output.write("\n");
        
        // 10-fold cross-validation
        BayesMultiNetTAN multinet2 = new BayesMultiNetTAN();
        Evaluation evaluation = new Evaluation(data);
        evaluation.crossValidateModel(multinet2, data, 10, new Random(1));
        output.write(evaluation.toSummaryString());
        output.write("Weighted area under ROC: ");
        output.write(Double.toString(evaluation.weightedAreaUnderROC()));
        output.write("\n");
        
        // compare positive and negative accuracy rates
        // when i = 0, true negative (control)
        // i = 1 to 5, true positive (control)
        for (int i = 0; i <= 5; i++) {
            output.write(Double.toString(evaluation.falsePositiveRate(i)));
            output.write("\n");
        }
        
        output.close();
    }
}