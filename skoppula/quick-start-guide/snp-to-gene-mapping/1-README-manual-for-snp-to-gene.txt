-------------------------------------------------------------------------------------
This document is a brief manual on how to determine a SNP to Gene to Pathway mapping.
This document references code that can be found in this directory and on BCL's GitHub 
under GroupData/Skanda.

If you need clarification, notice any errors, or encounter any problems, 
please feel free to contact Skanda (skoppula@andover.edu). 
I would be more than happy to include improvements or additions. Enjoy!
Last Revision: June 9, 2012
-------------------------------------------------------------------------------------
Note that most programs must be compiled and executed by the user, because the input 
directories/names were hardcoded into the source. I originally intended for these
programs to be just tools for me. Time permitting, I'll generalize the use of the 
programs. That means, to use these programs in your project now, you'll need to 
change the value of some of the variables (named something along the lines of 
"inputfile") to suite your project's specifications.
-------------------------------------------------------------------------------------

A. Map each SNP to a Gene
	How many SNPs do you want to analyze?
	1. For a small number of SNPs (less than 200,000)
		a. Create a text file containing the list of SNPs you want to analyze
			i. 	If you already have a text file containing said SNP list, change
				the file's extension to .wr. An example of such a list:
					/quick-start-guide/snp-to-gene-mapping/coga-sync-complete-SNPlist.wr
			ii. If your list of SNPs right now is just the list of features that
				precedes data in an CSV file, you can use a small java tool
				to extract the naked list of features (SNPs since you have SNP data):
					/quick-start-guide/snp-to-gene-mapping/ExtractListOfSNPs.java
				An example CSV file can be found on Safar (I couldn't include it in
				this directory because it is too large a file):
					/scratch/koppula/data/coga-sync.csv
				A similar tool can be easily made to extract a list from .arff data
			
		b. Run WGAViewer: WGAViewer/WGAViewer.jar. Click on 
			Tools/Annotate A List of SNPs. Select the file containing the SNPs
			you want to annotate (map), and set the annotation limits as desired.
			Click Annotate to start annotation, wait, and save the output spreadsheet.
			For each SNP, the spreadsheet contains a gene(s) nearest to the SNP. This
			is the basis of the mapping. Both the spreadsheet, and the number of the 
			column (which lists these near genes) are used in the lab's implementation
			of predictive pathway analysis [the Pipeline program].
			
	2. For a large number of SNPs (more than 200,000)*
		Note: Annotation of a large number of SNPs (e.g. a million) takes days with standard
		computing resources. One way I circumvent this is by dividing the list of SNPs 
		into multiple smaller lists, and analyzing each one on a different machine in
		running WGAViewer (manual parallelization).
		
		a. Create a set of text files, each containing a unique subset of the list of
			SNPs produced in A.1.a. You partition the list into files of n SNPs each
			using my small tool:
				/quick-start-guide/snp-to-gene-mapping/DataPartition.jar
			Run with parameters as follows:
				args[0] is the CSV containing the data and preceding list of features
				args[1] is the number of SNPs per file
				args[2] is the folder where you want to 
			For example:
				java -jar DataPartition.jar coga-sync-complete-clinicaldata.csv 100000 C:/home/skanda/PRIMES/data/coga-sync-data/distrofiles
			Again, I've included the source if you need to modify the code a bit if
			your using .arff data, or just a list of SNPs:
				/quick-start-guide/snp-to-gene-mapping/DataPartition.java
			Sample out can be found at: 
				/quick-start-guide/snp-to-gene-mapping/distributed-files-100000 
		
		b. Each file generated in 2.a. can be run through WGAViewer, resulting in
			a set of output spreadsheets. For example, those found in:
				/quick-start-guide/snp-to-gene-mapping/header
			We want to merge these files to produce a final spreadsheet mapping all
			out SNPs to all our genes. Before we merge the files, first get rid of
			the header rows in all the files (I did this deletion manually).
			Finally, to merge the resulting no-header files:
				/quick-start-guide/snp-to-gene-mapping/noheader
			I used a small script:
				/quick-start-guide/snp-to-gene-mapping/merge-data.bat	
			
	*Note: One thing on my to-do lsit is integrating the code from this outline and 
			the WGAViewer source as a module to the Pipeline program. That way,
			we can run the entire package seamlessly on Safar or another powerful
			machine. I'll update this when that finishes.