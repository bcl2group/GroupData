-------------------------------------------------------------------------------------
This document is a brief manual on how to perform predictive pathway analysis - 
that is, our implementation of it - the Pipeline program. This document references 
code that can be found in this directory and on BCL's GitHub under GroupData/Skanda.
A large portion of this pipeline was written by Kent Huynh and Amin Zollanvari.

If you need clarification, notice any errors, or encounter any problems, 
please feel free to contact Skanda (skoppula@andover.edu). 
I would be more than happy if you have improvements or additions. Enjoy!
Last Revision: June 9, 2012
-------------------------------------------------------------------------------------
A. Introduction
	The pipeline is intended to determine sets of features that produces a 
	statistically significant classifier. The pipeline was written in Java. 
	You can find the latest source code here:
		/quick-start-guide/predictive-pathway-analysis/pipeline-with-src-april-2012/src
	
B. Running the Pipeline
	1. The pipeline is generally run using a small script. You can modify a previously
		used script to suite your project:
			/quick-start-guide/predictive-pathway-analysis/run-pipeline-coga
		It's recommended to run the script on Safar using nohup:
			nohup ./run-pipeline-coga &
			
	2. Notice from the script that the Pipeline accesses a properties file. The file
		contains parameter values that are used by the pipeline to perform the
		desired analysis. An example properties file can be found:
			/quick-start-guide/predictive-pathway-analysis/coga.properties.txt
			
		I suggest looking through the source code (especially the comments in the
		Main2 class) to find a more complete idea of the parameters that you can modify.
		Take note of the convention used for analyzing multiple sets of pathways lists.
		Training data must fit the ARFF or CSVsyntax. Additionally, if your analysis
		requires SNP data you must have names a WGAViewer SNP annotation output
		(or file formatted similarly).
		
	3. The output of the pipeline analysis is a set of text files in the specified output 
		directory with the computed AUROC and significance of each pathway tested.
		Sample output:
			/quick-start-guide/predictive-pathway-analysis/sample-output