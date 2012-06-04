package analysis;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import weka.attributeSelection.PrincipalComponents;
import weka.attributeSelection.Ranker;
import weka.core.Attribute;
import weka.core.Instances;
import weka.core.converters.ArffSaver;
import weka.filters.Filter;
import weka.filters.supervised.attribute.AttributeSelection;
import weka.filters.unsupervised.attribute.AddExpression;
import weka.filters.unsupervised.attribute.AddValues;
import weka.filters.unsupervised.attribute.MergeTwoValues;
import weka.filters.unsupervised.attribute.NumericToNominal;
import weka.filters.unsupervised.attribute.Remove;
import weka.filters.unsupervised.attribute.SwapValues;



/**
 *
 * @author Aaron
 */
public class Main {

    /**
     * @param args
     * If first argument is 0, then the script will convert a LocusXdna into a square csv -
     * the second argument will be the inputPath for the LocusXdna file
     * and the third argument will be the outputPath for the square csv
     * it will also output a phenotype file (needed by the analysis script) with "_pheno.csv" concatenated to the outputPath
     * If you have a training batch and a validation batch, run this script with the first argument TRUE on each batch.
     *
     * If first argument is 1, then the script will combine the phenotype files and create an .arff file
     * The 2 argument indicates the existence of a validation set - if two datasets exist, then TRUE, otherwise if only one dataset exists, then FALSE
     * The 3 argument is the name of the data file for the training batch
     * The 4 argument is the name of the phenotype file for the training batch
     * The 5 argument is the name of the data file for the validation batch (if present)
     * The 6 argument is the name of the phenotype file for the training batch (if present)
     *
     * If first argument is 2, then the script will run an analysis
     * The 2 argument indicates the existence of a validation set - if two datasets exist, then TRUE, otherwise if only one dataset exists, then FALSE
     * The 3 argument is how many of the top chi2 sorted features to consider in the roc sort (50,000-200,000 per million features should be sufficient)
     * The 4 argument is how many of the top ROC sorted features to consider in the network (4000-15000 should be sufficient in most cases)
     * The 5 argument is the name of the training .arff file
     * The 6 argument is the name of the validation .arff file (if present)
     */
    public static void main(String[] args) {

        if (Integer.parseInt(args[0])==0){  // If you have a training batch and a validation batch, run this script once on each.

        BufferedWriter out = null;
        BufferedWriter out_pheno = null;
        String inputFilePath = args[1];
        String outputFilePath = args[2];
        String phenotypeFilePath = outputFilePath.substring(0,outputFilePath.lastIndexOf(".")).concat("_pheno.csv");

        try {

            File flout = new File(outputFilePath);
            out = new BufferedWriter(new FileWriter(flout));
            BufferedReader br = new BufferedReader(new FileReader(inputFilePath));

            String input = "";
            for (int i = 0; i < 12; i++) {
                input = br.readLine();
            }
            out.write("Subjects,");

            //The 13th line has the header information
            input = br.readLine();
            String[] line13 = input.split(",");

            for (int i = 3; i < line13.length; i++) {
                out.append(line13[i].concat(","));
            }


            br.close();
            out.close();
        } catch (IOException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                out.close();
            } catch (IOException ex) {
                Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        // now that the header is set - add the data in
        try {

            File flout = new File(outputFilePath);
            File fl_pheno = new File(phenotypeFilePath);
            out = new BufferedWriter(new FileWriter(flout,true));
            out_pheno = new BufferedWriter(new FileWriter(fl_pheno,true));
            BufferedReader br = new BufferedReader(new FileReader(inputFilePath));

            // The first 21 lines do not contain data
            String input = "";
            for (int i = 0; i < 21; i++) {
                input = br.readLine();
            }

            out.newLine(); // closes off the header line

            String[] line22;
            String unused = "";

            input = br.readLine();
            if (input!=null){
                unused = br.readLine(); // even numbered lines don't contain the data we use
            }

            while (input!=null){
                line22 = input.split(",");


            //The 8th cell contains the first data column
                out.append("S".concat(line22[0]).concat(","));
                out_pheno.append("S".concat(line22[0]).concat(","));
                out_pheno.newLine();
               for (int i = 8; i < line22.length; i++) {
                    out.append(line22[i].replace('U', '?').concat(","));
                } //The U stand for ungenotyped, so they should be entered as missing values, denoted by ?
                out.newLine(); // closes off the data line  (phenotypes will be added later)

                input = br.readLine();
                if (input!=null){
                    unused = br.readLine(); // even numbered lines don't contain the data we use
                }
            }
            br.close();
            out.close();
            out_pheno.close();
        } catch (IOException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                out.close();
                out_pheno.close();
            } catch (IOException ex) {
                Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
        }


	} else if (Integer.parseInt(args[0])==1) { // If the first args[] is 1, then this happens:

        BufferedWriter out = null;
        BufferedWriter out_pheno = null;
        Boolean validationSetExists = Boolean.parseBoolean(args[1]);
        String inputFilePath_data = args[2];
        String inputFilePath_pheno = args[3];
        String outputFilePath = (new File(inputFilePath_data)).getParent().concat("/training_01.csv");

        String inputFilePath_data_validation = "";
        String inputFilePath_pheno_validation = "";
        String outputFilePath_validation = "";

        addPheno(outputFilePath, inputFilePath_data, inputFilePath_pheno, out);
        System.out.println("pheno added");
        try {
                CSV2Arff.convertCSVtoARFF(outputFilePath, outputFilePath.substring(0, outputFilePath.lastIndexOf(".")).concat(".arff"));
            } catch (Exception ex) {
                Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
        System.out.println("arff converted");


        if (validationSetExists){
            inputFilePath_data_validation = args[4];
            inputFilePath_pheno_validation = args[5];
            outputFilePath_validation = (new File(inputFilePath_data)).getParent().concat("/validation_01.csv");
            addPheno(outputFilePath_validation, inputFilePath_data_validation, inputFilePath_pheno_validation, out_pheno);
            System.out.println("pheno added");
            try {
                CSV2Arff.convertCSVtoARFF(outputFilePath_validation, 
                        outputFilePath_validation.substring(0, outputFilePath_validation.lastIndexOf(".")).concat(".arff"));
                        System.out.println("arff converted");    
            } catch (Exception ex) {
                Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

    } else if (Integer.parseInt(args[0])==2) {
        BayesAttSel bas = null;
        Boolean validationSetExists = Boolean.parseBoolean(args[1]);
        int chi2toSel = Integer.parseInt(args[2]);
        int rocNumToSel = Integer.parseInt(args[3]);
        String training_arff = args[4];
        String validation_arff = "";

        if (validationSetExists){
            validation_arff = args[5];
        }



        try {
            if (validationSetExists){
                bas = new BayesAttSel(training_arff,validation_arff);
                } else {
                bas = new BayesAttSel(training_arff);
            }

            bas.execute(chi2toSel,rocNumToSel);
            } catch (Exception ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
    } else if (Integer.parseInt(args[0])==3) {

        String tr_st = args[1];
        String va_st = args[2];

        Instances tr_pca = null;
        Instances va_pca = null;

        try{
            Instances tr = new Instances(new BufferedReader(new FileReader(tr_st)));
            Instances va = new Instances(new BufferedReader(new FileReader(va_st)));
            tr.setClassIndex(tr.numAttributes()-1);
            va.setClassIndex(va.numAttributes()-1);



            System.out.println(tr.numAttributes());
            System.out.println(va.numAttributes());
            System.out.println(tr.numInstances());
            System.out.println(va.numInstances());

            AttributeSelection asel = new AttributeSelection();
            PrincipalComponents pca = new PrincipalComponents();
            Ranker rnk  = new Ranker();
            rnk.setNumToSelect(10);

            asel.setEvaluator(pca);
            asel.setSearch(rnk);

            asel.setInputFormat(tr);
            tr_pca = Filter.useFilter(tr, asel);
            va_pca = Filter.useFilter(va, asel);
            tr_pca.setClassIndex(tr_pca.numAttributes()-1);
            va_pca.setClassIndex(va_pca.numAttributes()-1);

            
            System.out.println(tr_pca.numAttributes());
            System.out.println(va_pca.numAttributes());
            System.out.println(tr_pca.numInstances());
            System.out.println(va_pca.numInstances());

//
            AddValues av = new AddValues();
            av.setAttributeIndex("last");
            av.setLabels("validation_".concat(va_pca.attribute(va_pca.numAttributes()-1).value(0).concat(",").concat("validation_".concat(va_pca.attribute(va_pca.numAttributes()-1).value(1)))));
            av.setInputFormat(va_pca);
            va_pca = Filter.useFilter(va_pca, av);
            tr_pca = Filter.useFilter(tr_pca, av);


            SwapValues sv1 = new SwapValues();
            sv1.setAttributeIndex("last");
            sv1.setFirstValueIndex("1");
            sv1.setSecondValueIndex("3");
            sv1.setInputFormat(va_pca);
            va_pca = Filter.useFilter(va_pca, sv1);

            SwapValues sv2 = new SwapValues();
            sv2.setAttributeIndex("last");
            sv2.setFirstValueIndex("2");
            sv2.setSecondValueIndex("4");
            sv2.setInputFormat(va_pca);
            va_pca = Filter.useFilter(va_pca, sv2);

            for (int i = 0; i < va_pca.numInstances(); i++) {
                tr_pca.add(va_pca.instance(i));
            }

            String saveName = tr_st.substring(0,tr_st.lastIndexOf(".")).concat("_PCA_Plot_with_Validation.arff");

            ArffSaver saverLearn = new ArffSaver();
            saverLearn.setInstances(tr_pca);
            saverLearn.setFile(new File(saveName));
            saverLearn.writeBatch();

            }
        catch (Exception ex){System.out.println(ex.toString());}
        }
    }

    private static void addPheno(String output, String dataFile, String phenoFile, BufferedWriter writer) {
        try {
            File flout = new File(output);
            writer = new BufferedWriter(new FileWriter(flout));
            BufferedReader br_data = new BufferedReader(new FileReader(dataFile));
            BufferedReader br_pheno = new BufferedReader(new FileReader(phenoFile));
            writer.write("");
            // The first 21 lines do not contain data
            String input_data = br_data.readLine(); //translate the the header line unchanged
            writer.append(input_data.concat("Pheno")); //The comma is already there
            writer.newLine(); // closes off the data line
            input_data = br_data.readLine(); // this is the first line of data
            String input_pheno = br_pheno.readLine(); //there is no header in this file, so this is the first line
            while (input_data != null) {
                writer.append(input_data.concat(input_pheno.split(",")[1])); //adds the phenotype, which is in the second position
                writer.newLine(); // closes off the data line
                input_data = br_data.readLine();
                input_pheno = br_pheno.readLine();
            }
            br_data.close();
            br_pheno.close();
            writer.close();
        } catch (IOException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                writer.close();
            } catch (IOException ex) {
                Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }


    }




//            AddExpression ae = new AddExpression();
//            ae.setExpression("a".concat(String.valueOf(va_pca.numAttributes())));
//            ae.setName("Pheno2");
//            ae.setInputFormat(va_pca);
//            va_pca = Filter.useFilter(va_pca, ae); //this adds the new attribute
//            //10 = phenoOld
//            //11 = pheno2
//
//
//            Remove rm = new Remove();
//            va_pca.setClassIndex(va_pca.numAttributes()-1);
//            int[] y = {va_pca.numAttributes()-2};
//            rm.setAttributeIndicesArray(y);
//            rm.setInputFormat(va_pca);
//            va_pca = Filter.useFilter(va_pca, rm); //this removes the old one
//            //10 = pheno2
//
//            ae = new AddExpression();
//            ae.setExpression("a".concat(String.valueOf(va_pca.numAttributes())));
//            ae.setName("Pheno");
//            ae.setInputFormat(va_pca);
//            va_pca = Filter.useFilter(va_pca, ae); //this adds the new attribute
//
//            //10 = pheno2
//            //11 = pheno
//
//            rm = new Remove();
//            va_pca.setClassIndex(va_pca.numAttributes()-1);
//            int[] z = {va_pca.numAttributes()-2};
//            rm.setAttributeIndicesArray(z);
//            rm.setInputFormat(va_pca);
//            va_pca = Filter.useFilter(va_pca, rm); //this removes the old one
//
//            NumericToNominal n2n = new NumericToNominal();
//            int[] x = {va_pca.numAttributes()-1};
//            n2n.setAttributeIndicesArray(x);
//            n2n.setInputFormat(va_pca);
//            va_pca = Filter.useFilter(va_pca, n2n); //this converts it to the correct format
//
//
//
//            va_pca.setClassIndex(va_pca.numAttributes()-1); // resets the class variable
