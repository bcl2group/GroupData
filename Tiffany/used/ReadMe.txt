1. Use the GetGEODescription.R file to get the description associated with each GEO DataSet record. The list of all GDS ID's should be in the text file GDSIDsList.txt. This program creates a new file 


2. The file GEODescriptionsToUMLSOnlyMappings.java uses the MetaMap Java API and the just created file GDSIDsList.txt to get the UMLS concepts associated with each GEO DataSet and saves it to file GDSToUMLSMappings.txt. Each GDS ID has been matched with the UMLS concepts that MetaMap maps it too. (We can also use instead use the file GEODescriptionsToUMLSAllCandidates.java to match each GDS ID with all UMLS concepts that MetaMap considers as candidates for matching. This file saves GDS ID to UMLS concepts matching in file GDSToUMLSCandidates.txt).


3. The file CombineMeSHUMLS.java takes in the GDS to UMLS mapping (using GDSToUMLSMappings.txt or GDSToUMLSCandidates.txt) as well as the GDS to MESH mapping (using file GDSPubmedMeSH.txt) and combines the MeSH terms and UMLS concepts associated with each experiment and saves it into a file GDSIDsUMLSMESH.txt.


4. The file ICD10SymptomsGetter.java goes through all the codes in ICD-10 in codes.txt and extracts the leaf nodes saving them into symptoms.txt


5. The files MeSHTermsSymptomsFilter.java and MeSHTermsSymptomsSoftMatch.java use the files GDSIDsUMLSMESH.txt and symptoms.txt to create the mapping between GDSID's to symptoms (and vice versa) using exact matching and approximate string matching respectively. MeSHTermsSymptomsFilter.java creates two files GDSIDstoSymptoms.txt and symptomsToGDSIDs.txt, while MeSHTermsSymptomsSoftMatch.java creates two files GDSIDstoSymptoms_Soft and symptomsToGDSIDs_Soft.txt.


6. After finding the GDS IDs for a particular symptom use the file GEOpipeline.R (Author: Neena Parikh). Copy and paste in the string of comma-separated GDS IDs at the top of the R file and assign it to the object named "ids".

From Neena Parikh's notes on the pipeline:
"
The R program follows this basic structure:
	
1. Determines which experiments are "interesting" based on their contents
	
2. Finds intersection of genes across all experiments

	3. Determines which samples correspond to control vs. noncontrol
	
4. Finds top differentially expressed genes for each experiment

	5. Finds intersection of genes among these top differentially expressed genes
	
6. Creates "interesting reduced experiments" (IREs), which are essentially data tables that represent each of the interesting experiments and their expression data from each GSM sample. They are "reduced" because only the data from the common genes is included  in each data table.
	7. Normalizes the IREs by using a reference IRE, finding its median, and subtracting the difference between the reference median and each IRE's median from all values in each IRE
	
8. Creates ARFF files with the data from these genes
"



7. The R program prints out the "interesting" experiments as well as the phenotype column used for disease state designation (case/control) in the associated GDS Sample record. Manually search for these datasets on the GEO website http://www.ncbi.nlm.nih.gov/geo/ and see information about the samples to check whether the disease state (case/control) can be extended to symptoms



2nd Approach 

If you uncomment the two lines in GEODescriptionsToUMLSAllCandidates.java or GEODescriptionsToUMLSOnlyMappings.java, "//String theOptions = "-J soy";" and "//api.setOptions(theOptions);", it will generate the mapping of GDS ID's to symptoms derived from Metamap (maps GDS ID to UMLS concepts having semantic type 'Signs and Symptoms'). The file GetSymptomsToGDS.java then derives the reverse mapping i.e symptoms to GDS ID's (SymptomsToGDSCandidates.txt or SymptomsToGDSMappings.txt). The pipeline can then be used in the same way using symptoms and GDS ID's.