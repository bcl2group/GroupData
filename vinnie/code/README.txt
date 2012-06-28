

First run "python run_bayes_other useful". This will extract all the "useful" experiments for each disease. Around line 347, you can indicate the disease(s) you're interested in getting the usesful ids for. Useful experiments are defined as those with a control and non-control group. Alternatively, the useful_disease lists (txt files) are included in the github, and you can just use those instead of running this command. 

In order to download, parse, and convert GEO files to .arff files, use the file: run_bayes_other.py
This file automatically creates a directory for the disease you're interested in under (if you're on either safar or mendel) 
/scratch/vinnie/GEOPipelineFiles_ubuntu/results/disease-name_binarize

Towards the end of the file are a bunch of (mostly commented out) run_test commands. the first command is the list of disease id's youre interested in. (given a disease name a little bit higher up in the code, it automatically pulls the GEO ids). next is whether you want the resulting file to be test or train data. next argument indicates whether this .arff file is for a single experiment ('single') or for combining multiple experiments ("multi"). Next argument is the threshold (indicates the percentage of samples which make up the training data). Next argument is the disease, and the last argument is a string of disease ids. 

This file will run binarize_GEOPipline.R for indicated experiments + disease and create the resulting (binarized) .arff file. 

In binarize_GEOPipeline.R, run with a higher percentage of genes to get more features. 

When the arguments to run_test have been set, just run "python run_obesity_bayes_other" in the command line. 


Once you have completed this for a particular disease, just run split_files_hs.py (or split_files_hs_alt.py). Before you run this, you may need to compile the java file (attribute_selector_ranker.java) by running "javac -g attribute_selector_ranker.java" in command line. Then run "python split_files_hs disease_name" where disease_name is the name of your disease (case sensitive). This file takes the .arff files created in the previous step, splits it appropriately according to threshold (10% training, 20% training, etc, and you can set these within the file). It then calls the file control_attribute_selector.py. This file calls the java file (attribute_selector_ranker.java) running weka. control_attribute_selector spawns bayes nets (via the java file)for each every threshold and for increasing number of features. Parse_results.py and csv_analyzer.py were made to parse and store the results of the bayes nets.

So basically, in order to run all the bayes nets (for each threshold + feature number combo) just run "python split_files_hs disease_name". This automates all the next steps (creating bayes nets etc). 