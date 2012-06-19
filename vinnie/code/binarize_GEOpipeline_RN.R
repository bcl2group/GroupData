# This is the final working pipeline file that creates 2 text files at the end
#	that are able to be used by Albert's Multinet Builder java program (which 
#	uses weka).
# This pipeline works in this structure:
#	1. Determine which experiments are "interesting" through a variety of steps
#	2. Find intersection of genes across all experiments
#	3. Determine which samples correspond to control vs. noncontrol
#	4. Find top differentially expressed genes for each experiment
#	5. Find intersection of genes among top differentially expressed genes
#	6. Create "interesting reduced experiments" (IREs), which are essentially
#		data tables that represent each of the interesting experiments and their
#		expression data from each GSM sample. They are "reduced" because only the data
#		from the common genes is included in each data table.
#	7. Normalize IREs by using a reference IRE, finding its median, and subtracting
#		the difference between the reference median and the IRE's median from each
#		value in the IRE
#	8. Create ARFF files with the data from these genes


	
#library(GEOquery)
#library(limma)

#print(packageDescription("RCurl"))
#library(bitops, lib="/scratch/vinnie")
#library(RCurl, lib="/scratch/vinnie")
#print("loaded RCurl?")
library(Biobase, lib="/scratch/vinnie")
#print("loaded biobase?")
#library(RCurl, lib="/scratch/vinnie")
library(GEOquery, lib="/scratch/vinnie/")
#print("got geoquery")
library(limma, lib="/scratch/vinnie/")
#print("loaded limma?")

#get list of program inputs
# everything after --args is returned
# usage: --args ?disease? train/test single/multi exp_to_split threshold
inputs <- commandArgs(trailingOnly = TRUE)

action <- inputs[[1]] #test/train
split_type <- inputs[[2]] #single/multi
#exp_split <- paste("GDS",inputs[[3]],sep="") 
exp_split <- inputs[[3]] 
threshold_input <- as.numeric(inputs[[4]])
disease <- inputs[[5]]
all_ids <- inputs[[6]]
#platform <- inputs[[7]]

print("all ids")
print(all_ids)
print("disease")
print(disease)
print("exp split")
print(exp_split)

print("working directory")
print(getwd())
#print(paste(exp_split,"_Obesity_", action, "ing_",split_type,"_split_", "blah", sep=""))

# Directory where disease to GDS mappings are saved
setwd("/scratch/vinnie/GEOPipelineFiles_ubuntu/")
	
# First we need to get all the GDS IDs related to the disease


# Example: obesity IDs
#ids <- "GDS1480,GDS1481,GDS1495,GDS1496,GDS1497,GDS1498,GDS157,GDS158,GDS160,GDS161,GDS162,GDS2089,GDS268,GDS3104,GDS3347,GDS3423,GDS3601,GDS3602,GDS3679,GDS3681,GDS3694,GDS915"

# useful obesity ids
#ids <- "GDS3104,GDS3347,GDS3423,GDS3679,GDS3681"

#testing obesity ids (split 3323)
#ids <- "GDS3423,GDS3681"
if(split_type == 'multi') {

  #ids <- "GDS3104,GDS3347,GDS3423,GDS3679,GDS3681"
  #diabetes ids
#  ids <- "GDS3104,GDS3347,GDS3681,GDS961"
  ids <- all_ids
  print("Ids")
  print(ids)
  print("in multi")
} else {
  #ids <- "GDS3681"
  #ids <- paste("GDS",exp_split,sep="")
  ids <- exp_split
  print("id to split")
  print(ids)
  print("in single")
} 

print("all ids ---> ")
print(ids)

# Variables used throughout the program
percentTopGenes = 10 # percent of topTable genes

displayPValues = TRUE # If true, will print out p-values at the end
useTotalCommonGenes = TRUE # If true, will use all common genes (not just top diff exp)
#useTotalCommonGenes = FALSE # If true, will use all common genes (not just top diff exp)


print("done with initial parameters")


#------------------------------------------------------------------------------------------

# File that holds GDS titles
fileGDStitles = "GDStitles.txt"

print("am i about to start downloading files?")

# Create a table that holds all the IDs
s <- c(as.character(ids))
print("how about now?")
t <- read.csv(textConnection(s), header=FALSE)
print("now?")
close(textConnection(s))
print("i hope now?")

# Create a vector that holds the IDs
vectorIDs <- rep(NA, 1)
vid = 1 # Index of vectorIDs
for (id in t) {
	vectorIDs[vid] <- as.character(id)
	vid <- vid+1
}

# Create a vector that will hold the experiments (GDS IDs) that we will want
#	to use in the next part of the pipeline
# Also create a list to hold all the "PC" column tags
usefulIDs <- list()
u = 1 # Index of usefulIDs
pcTags <- list()

# A list that holds all the keywords related to control
controlKeywords <- c("normal","Normal","NORMAL","control","Control","CONTROL","control subject",
		"Control subject","Control Subject","CONTROL SUBJECT","uninfected","Uninfected","UNINFECTED",
		"no cancer","No cancer","No Cancer","NO CANCER")

# Lists to hold all the GDS and eset files
gdsList <- list()
esetList <- list()

# Iterate through all of the IDs
for (id in vectorIDs) {
	print(id)
	download_dir = "/scratch/vinnie/GEOPipelineFiles_ubuntu/tmp"
#	gds <- getGEO(id)
	print("download file dest")
	options('download.file.method.GEOquery' = "wget")
#	print("cabilities")
#	print(capabilities())
#	gds <- getGEO(GEO=id, destdir=download_dir)

	gds_dir = paste('/scratch/vinnie/GEOPipelineFiles_ubuntu/tmp/', id, '.soft.gz', sep="")
	gds <- getGEO(filename=gds_dir)

	print("finished getGEO")
	print("printing gds platform")
#	print(gds[["platform"]])
	print(Meta(gds)$platform)
	platform_name = Meta(gds)$platform
	gpl_url = paste('ftp://ftp.ncbi.nlm.nih.gov/pub/geo/DATA/annotation/platforms/', platform_name, '.annot.gz', sep="")
#	gpl_url_test = 'ftp://ftp.ncbi.nlm.nih.gov/pub/geo/DATA/annotation/platforms/GPL101.annot.gz'
	#gpl_dir = '/scratch/vinnie/GEOPipelineFiles_ubuntu/platforms/GPL96.annot.gz'
	gpl_dir = paste('/scratch/vinnie/GEOPipelineFiles_ubuntu/platforms/', platform_name, '.annot.gz', sep="")
#	gpl_dir_test = '/scratch/vinnie/GEOPipelineFiles_ubuntu/platforms/GPL101.annot.gz'

	download.file(gpl_url,gpl_dir, 'wget', quiet=TRUE) 

#	download.file(gpl_url_test,gpl_dir_test, 'wget', quiet=TRUE) 
#	untar('/scratch/vinnie/GEOPipelineFiles_ubuntu/platforms/GPL96.annot.gz')
#	gpl <- getGEO(filename=gpl_dir)
	gpl <- getGEO(filename=gpl_dir)
	eset <- GDS2eSet(gds, do.log2=TRUE, GPL=gpl)
	#eset <- GDS2eSet(gds, do.log2=TRUE, GPL=gpl_dir)
	#eset <- GDS2eSet(gds, do.log2=TRUE)
#	eset <- GDS2eSet(gds, do.log2=TRUE, GPL="ftp://ftp.ncbi.nlm.nih.gov/pub/geo/DATA/annotation/platforms/")
	print("got gpl!!")
	pData <- pData(eset)
	
	gdsList[[id]] <- gds
	esetList[[id]] <- eset
	
	# Stores the column names in a vector
	colNames <- names(pData)
	
	# Checks if "other columns except sample and description" (OC) contain time
	# If yes, go to the next experiment; if no, go on to next step
	if (!("time" %in% colNames)) {
		print("OC does not contain time --> go to next step")
		
		# Checks if OC contain a column which contains either 'normal' or
		#	'control' or 'uninfected' or 'no cancer'
		# If yes, go on to next step; if no, go to the next experiment
		ocContainsKeyword = FALSE
		colsWithKeywordCount = 0
		colsWithKeyword <- rep(NA, 1)
		i = 1
		for (col in colNames) {
			if (!(col == "sample" || col == "description")) {
				for (word in controlKeywords) {
					if (word %in% levels(pData[[col]])) {
						ocContainsKeyword = TRUE
						colsWithKeyword[i] <- col
						i = i+1
						colsWithKeywordCount = colsWithKeywordCount + 1
					}
				}
				
			}
		}
		if (ocContainsKeyword) {
			print ("OC contains keyword")
			
			# Now we need to determine which will be the Phenotype Column (PC)
			pc = ""
			
			# Checks if just one column contains keywords
			if (colsWithKeywordCount == 1) {
				print ("Just one column with keywords --> save as PC and continue")
				pc <- colsWithKeyword[1]
			}
			else {
				print ("More than one column with keywords --> continue")
				
				# Checks if more than 2 columns contain keywords
				if (length(colsWithKeyword) > 2) {
					print ("More than 2 columns with keywords --> continue")
					
					# Checks if one of the columns with keyword is disease.state
					# If yes, go to next step; if no, go to next experiment
					if ("disease.state" %in% colsWithKeyword) {
						pc = "disease.state"
						print ("One of columns is disease.state --> save as PC and continue")
					}
					else {
						print ("No disease.state --> go to next experiment")
						print ("******************************************")
					}
				}
				else {
					print ("Only 2 columns with keywords --> assign numbers to each and continue")
					
					# Assign numbers to each column that has keyword
					colNums <- rep(NA, length(colsWithKeyword))
					j = 1
					for (keyCol in colsWithKeyword) {
						if (keyCol == "disease.state") {
							colNums[j]<-1
							j = j + 1
						}
						else if (keyCol == "protocol") {
							colNums[j]<-2
							j = j + 1
						}
						else if (keyCol == "dose" || keyCol == "agent"
								|| keyCol == "genotype/variation") {
							colNums[j]<-3
							j = j + 1
						}
						else if (keyCol == "strain") {
							colNums[j]<-4
							j = j + 1
						}
						else {
							colNums[j]<-5
							j = j + 1
						}
					}
					
					# Column with smaller number is PC
					if (colNums[1] < colNums[2]) {
						pc<-colsWithKeyword[1] 
						print ("PC is column with smaller number, continue")
					}
					else if (colNums[1]== colNums[2]) {
						# Column which contains "control" is PC
						
						# If both or neither contains "control"
						if ((("control" %in% levels(pData[[colsWithKeyword[1]]]))
									&& ("control" %in% levels(pData[[colsWithKeyword[2]]])))
								|| (!("control" %in% levels(pData[[colsWithKeyword[1]]]))
									&& !("control" %in% levels(pData[[colsWithKeyword[2]]])))) {
							
							print ("Both or neither column contains control")
							
							# Col with 2 factors is PC
							if ((length(levels(pData[[colsWithKeyword[1]]]))) == 2) {
								pc <- colsWithKeyword[1]
								print ("Column with 2 factors is PC, continue")
							}
							else if ((length(levels(pData[[colsWithKeyword[2]]]))) == 2) {
								pc <- colsWithKeyword[2]
								print ("Column with 2 factors is PC, continue")
							}
							else pc <- colsWithKeyword[1]; print ("PC is column closest to sample, continue")
							
						}
						# Col which contains "control" is PC
						if ("control" %in% levels(pData[[colsWithKeyword[1]]])) {
							pc <- colsWithKeyword[1]
							print ("PC is column which contains control, continue")
						}
						else if ("control" %in% levels(pData[[colsWithKeyword[2]]])) {
							pc <- colsWithKeyword[2]
							print ("PC is column which contains control, continue")
						}							
					}
					else {
						pc <- colsWithKeyword[2]
						print ("PC is column with smaller number, continue")
					}	
				}
			}
			
			# Checks if PC contains 2 factors
			# If yes, go on to next step; if no, go to next experiment
			if (!(length(levels(pData[[pc]])) == 2)) {
				print ("PC does not contain only 2 factors --> go to next experiment")
				print ("*---------------------------------------------------*")
			}
			else {
				usefulIDs[u] <- id
				u = u + 1
				pcTags[[id]] <- pc
				
				print ("PC only contains 2 factors --> ***SAVE THIS EXPERIMENT FOR NEXT PART OF PIPELINE***")
				print(paste("GDS ID: ", id))
				print(paste("PC column: ", pc))
				print ("*---------------------------------------------------*")
			}
		}
		else {
			print ("OC do not contain keyword --> go to next experiment")
			print ("*---------------------------------------------------*")
		}
	}
	else {
		print ("OC contains time --> go to next experiment")
		print ("*---------------------------------------------------*")
	}
}

print("Saved IDs:")
print(usefulIDs)


print("PC Tags:")
print(pcTags)


#------------------------------------------------------------------------
# Write GDS titles to file
#write("\n", file=fileGDStitles, append=TRUE)
#for (gdsID in usefulIDs) {
#	gds <- gdsList[[gdsID]]
#	title <- Meta(gds)$title
#	write(paste(gdsID, title, sep = "\t"), file=fileGDStitles, append=TRUE)
#}
# Find ALL common genes across all experiments

print("**Getting all genes for each experiment**")
listOfGeneLists <- list()
for (gdsID in usefulIDs) {
#for (gdsID in usefulIDs[[1]]) {
#for (gdsID in usefulIDs[[0]]) {
	print("gds id")
	print(gdsID)
	gds <- gdsList[[gdsID]]
	print("about to print my table of interest")
	print(Table(gds))
	print("about to print my level(table(gds))")
	print(levels(Table(gds)))

	geneSymbols <- toupper(levels(Table(gds)[["IDENTIFIER"]]))
	print("about to print gene symbols")
	print(geneSymbols)
	print("done printing gene symbols")
	if (length(geneSymbols)==0) {
		usefulIDsIndex <- which(usefulIDs==gdsID)
		usefulIDs[[usefulIDsIndex]] <- NULL
	}
	else {
		listOfGeneLists[[gdsID]] <- geneSymbols
	}
}
print("Length of each gene list:")
for (l in listOfGeneLists) print(length(l))



# Finds the intersection of all genes across all these platforms
print("**Finding intersection of all genes across all interesting experiments**")
totalCommonGenes <- list()

# Compare each list to each one and find all common genes
# First compare first and second list and find totalCommonGenes
#	Then compare third list to commonList to make new totalCommonGenes
#	Continue until final list is reached; then totalCommonGenes will have all common genes
k = 1 # Index in listOfGeneLists
for (gl in listOfGeneLists) {
	if (k > 1) {
		totalCommonGenes <- intersect(gl, totalCommonGenes)
	}
	# If only one gene list or on first gene list, then totalCommonGenes will be this whole list
	else totalCommonGenes <- gl 
	k = k + 1
}

print(paste("Number of total common genes: ", length(totalCommonGenes)))



#------------------------------------------------------------------------


	
	
# Merge all samples for control - create two lists, one to hold all the samples that
#	correspond to control and one for non-control
# Also create a list that holds each noncontrol sample's corresponding experiment tag
print("**Merging samples for control vs. noncontrol**")

controlKeywords <- c("normal","Normal","NORMAL","control","Control","CONTROL","control subject",
		"Control subject","Control Subject","CONTROL SUBJECT","uninfected","Uninfected","UNINFECTED",
		"no cancer","No cancer","No Cancer","NO CANCER")

controlList <- rep(NA, 1)
cl = 1 # Index of controlList

nonControlList <- rep(NA, 1)
ncl = 1 # Index of nonControlList
experimentTagList <- rep(NA, 1)

# Go through each experiment
print("about to go into currently working on loop")
for (id in usefulIDs) {
	print("in loop");
	print("Currently working on:")
	print(id)
	
	gds <- gdsList[[id]]
	eset <- esetList[[id]]
	pdata <- pData(eset)
	
	pcTag <- pcTags[[id]]

	
	threshold_percent = threshold_input/100 
#	exp_to_split = usefulIDs[[1]] 
	if (threshold_input == 100 || threshold_input == 0) {
		print("no splitting")
		exp_to_split = 'no splitting' 
	}
	else {
		exp_to_split = exp_split
	}
	print("experiment to split")
	print(exp_to_split)

	num_samples = round(threshold_percent * length(pdata$sample))
	print("num samples")
	print(num_samples)
	start = 1 
	threshold = num_samples
	threshold_start = threshold + 1
	threshold_end = threshold + 1
	threshold_start_ire = threshold_start + 1
	stop <- length(pdata$sample)
	
#	sample_list <- list()
#	sample_cols <- list()


	if (id == exp_to_split) {
		if (action == "test") {
#			sample_cols <- c(threshold_start:stop) 
			sample_cols = threshold_start:stop 
		} 
		else {
#			sample_cols <- c(start:threshold) 
			sample_cols = start:threshold 
		}	
		print(pdata$sample)
		sample_list <- pdata$sample[sample_cols] 
		print(sample_list)
	}
	else {
		sample_list <- pdata$sample
	}


#	if (id == exp_to_split) {
##		sample_list = pdata$sample[threshold+1:1:end]
#		print("gonna split!")
##		print("new sample list")
##		print(sample_list)
#		for(i in threshold_start:stop){
#			print("i")
#			print(i)
#			sample_name = pdata$sample[[i]]
#			sample_list[i-threshold] <- list(sample_name=sample_name)
##			sample_list[i] <- list(sample_name=sample_name)
#		}
#		print("splitted!")
#		print("new sample list")
#		print(sample_list)
#		print("checking smaple in samplelist")
#		for(sample in sample_list){
#			print("sample")
#			print(sample)
#		}
#		
#	}	
#	else{
#		sample_list = pdata$sample
#	}

#	for(i in threshold_start:stop){
#		print("i")
#		print(i)
#		sample_name = pdata$sample[[i]]
#		sample_list[i] <- list(sample_name=sample_name)
#	}

	print("sample list")
	print(sample_list)
	
#	if (id == exp_to_split) {
#		sample_list = pdata$sample[threshold+1:1:end]
#		print("gonna split!")
#		print("new sample list")
#		print(sample_list)
#		for(i in start:threshold){
#			print("i")
#			print(i)
#			sample_name = pdata$sample[[i]]
#			sample_list[i-threshold] <- list(sample_name=sample_name)
#		}
#		print("splitted!")
#		print("new sample list")
#		print(sample_list)
#		print("checking smaple in samplelist")
#		for(sample in sample_list){
#			print("sample")
#			print(sample)
#		}
#		
#	}	
#	else{
#		sample_list = pdata$sample
#	}
	# Go through each sample and find which are control vs. noncontrol
	#for (sample in pdata$sample) {
	for (sample in sample_list) {

		
		sampIndex <- which(pdata[,1]==sample) # Find index of this sample in the whole list
		sampleTag <- pdata[[pcTag]][sampIndex] # Find the classification of the sample in the pc column
		
		if (sampleTag %in% controlKeywords) {
			
			controlList[cl] <- sample
			cl = cl + 1
			
		}
		else {
			nonControlList[ncl] <- sample
			ncl = ncl + 1
			
			experimentTagList[[sample]] <- pcTag
			
		}
	}
	
}

print("Control samples:")
print(controlList)
print("Noncontrol samples:")
print(nonControlList)
#print("Experiment tags of noncontrol samples:")
#print(experimentTagList)



#------------------------------------------------------------------------

#while (percentTopGenes <= 40) {
#print(paste("Myelitis,", percentTopGenes))

#print(paste("3681_Obesity_testing_single_split_,", percentTopGenes))
#name1 = paste("3681_Obesity_testing_single_split_singlenet_", percentTopGenes, sep="")
#filenameSinglenet = paste(name1, "percent.txt", sep = "")
#name2 = paste("3681_Obesity_testing_single_split_", percentTopGenes, sep="")
#filename = paste(name2, "percent.txt", sep = "")
	
#print(paste(exp_split,"_Obesity_", action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep=""))
print(paste(exp_split,"_",disease,"_", action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep=""))
#name1 = paste(exp_split,"_Obesity_",action,"ing_",split_type,"_split_singlenet_threshold_",threshold_input,"_",percentTopGenes, sep="")

#result_directory = paste("/scratch/vinnie/GEOPipelineFiles_ubuntu/results/", disease, "_binarize", "/", exp_split, "/", action, "/", split_type, "/add_Neoplasm/", threshold_input, "/", sep = "")
result_directory = paste("/scratch/vinnie/GEOPipelineFiles_ubuntu/results_RN/", disease, "_binarize", "/", exp_split, "/", action, "/", split_type, "/", threshold_input, "/", sep = "")

print("result directory")
print(result_directory)

if (threshold_input == 0) {
	#name1 = paste(exp_split,"_remove_", disease,"_",action,"ing_",split_type,"_split_singlenet_threshold_",threshold_input,"_",percentTopGenes, sep="")
	#name1 = paste(exp_split,"_remove_GDS3101_remove_", disease,"_",action,"ing_",split_type,"_split_singlenet_threshold_",threshold_input,"_",percentTopGenes, sep="")
	name1 = paste(exp_split,"_remove_test_", disease,"_",action,"ing_",split_type,"_split_singlenet_threshold_",threshold_input,"_",percentTopGenes, sep="")
} else {
	name1 = paste(exp_split,"_", disease,"_",action,"ing_",split_type,"_split_singlenet_threshold_",threshold_input,"_",percentTopGenes, sep="")
}

#filenameSinglenet = paste(name1, "percent.txt", sep = "")
filenameSinglenet = paste(result_directory,name1, "percent.txt", sep = "")

#name2 = paste(exp_split,"_Obesity_",action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep="")
if (threshold_input == 0) {
#	name2 = paste(exp_split,"_remove_", disease,"_",action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep="")
	#name2 = paste(exp_split,"_remove_GDS3101_remove_", disease,"_",action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep="")
	name2 = paste(exp_split,"_remove_test", disease,"_",action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep="")
} else {
	name2 = paste(exp_split,"_", disease,"_",action,"ing_",split_type,"_split_threshold_",threshold_input,"_",percentTopGenes, sep="")
}

#filename = paste(name2, "percent.txt", sep = "")
filename = paste(result_directory, name2, "percent.txt", sep = "")
	
# Find differentially expressed genes for each experiment

print("**Finding differentially expressed genes for each experiment**")
listOfDiffExpGeneLists <- list() # Holds each GDS's differentially expressed genes
listOfTabd <- list() # Holds each GDS's topTable

for (gdsName in usefulIDs) {
	print("Currently working on:")
	print(gdsName)
	
	pcName = pcTags[[gdsName]]
	eset = esetList[[gdsName]]
	gds = gdsList[[gdsName]]
	
	gdsTable <- Table(gds)
	
	# If we want ALL GENES
	if (useTotalCommonGenes) numTopGenes <- length(gdsTable[["IDENTIFIER"]])
	
	# Find top differentially expressed genes using topTable
	design <- model.matrix(~factor(eset[[pcName]]))
	fit <- eBayes(lmFit(eset, design))
	
	# Get gene indexes of top differentially expressed genes
	numTopGenes <- ceiling(length(gdsTable[["IDENTIFIER"]]) * (percentTopGenes+1.5) / 100)
	tabd <- topTable(fit, coef=2, adjust="fdr", n=numTopGenes)
	geneIndexes <- as.integer(row.names(tabd))
	
	# Get corresponding gene IDs
	affyIDs <- featureNames(eset)[geneIndexes]
	
	# Convert to gene symbol
	geneSymbols <- rep(NA, 1)
	gs = 1 # Index of geneSymbols
	for (aID in affyIDs) {
		geneSymbol <- toupper(as.character(gdsTable[gdsTable[,1]==aID, 2]))
		
		if (!(geneSymbol == "--CONTROL")) {
			# Sometimes gene symbols have other words -- we want just the symbol
			thisStrsplit <- strsplit(geneSymbol, "")[[1]]
			thisGrep <- grep(" ", thisStrsplit)
			if (!(" " %in% thisStrsplit)) {
				geneSymbols[gs] <- geneSymbol
				gs = gs + 1
			}
			else {
				startIndex <- thisGrep[length(thisGrep)] + 1
				stopIndex <- length(thisStrsplit)
				actualGeneSymbol <- substr(geneSymbol, startIndex, stopIndex)
				geneSymbols[gs] <- actualGeneSymbol
				gs = gs + 1
			}
		}
		
		
	}
	
	listOfDiffExpGeneLists[[gdsName]] <- unique(geneSymbols)
	listOfTabd[[gdsName]] <- tabd
}

# Finds the common top differentially expressed genes
print("**Finding common top differentially expressed genes across all experiments**")
commonTopExpGenes <- rep(NA, 1)

# Compare each list to each one and find all common genes
k = 1 # Index in listOfGeneLists
for (gl in listOfDiffExpGeneLists) {
	if (k > 1) {
		commonTopExpGenes <- intersect(gl, commonTopExpGenes)
	}
	# If only one gene list or on first gene list
	else commonTopExpGenes <- gl 
	k = k + 1
}

print(paste("Number of common top differentially expressed genes:", length(commonTopExpGenes)))




#------------------------------------------------------------------------


# Create each IRE, represented as a data table
print("**Creating reduced experiments (IREs)**")


listOfIREs <- list()

for (id in usefulIDs) {
	print("Currently creating IRE for:")
	print(id)
	
	# First reduce the table based on common genes
	gds <- gdsList[[id]]
	print("threshold_start_ire")
	print(threshold_start_ire)
	#nonReducedTable <- Table(gds)[,2:length(names(Table(gds)))]
	print("gonna create non reduced table")

	print("non reduced subset")
#	nonReducedSubset <- subset(Table(gds), select=("IDENTIFIER", threshold_start_ire:length(names(Table(gds)))))
	print(" ### threshold start ire ### ")
	print(threshold_start_ire)
	print(" ### stop ### ")
	print(stop)

	if (id == exp_to_split) {
		if (action == 'test') {
			print("in ire if else test")
			cols <- c(2, threshold_start_ire:stop) 
			print("cols in if else test")
			print(cols)
		}
		else {
			print("in ire if else not test")
			cols <- c(2, start:threshold_end)
			print("cols in if else test")
			print(cols)
		}
		print("past if else cols")
		print(cols)
		nonReducedTable <- Table(gds)[,cols] 
	} else {
		nonReducedTable <- Table(gds)[,2:length(names(Table(gds)))]
	}

	print("got past if else")
#	print("length of cols ")
#	print(length(cols))
#	print("sample cols after")
#	print(sample_cols)
#	exp_cols <- c(2, sample_cols)
#	print("experiment")
#	print(exp_cols)

#	non_reduced_subset <- Table(gds)[,cols]	
#	print(non_reduced_subset)


	print("created non reduced table")
	print("about to print non reduced table")
	print(nonReducedTable)
	print("gonna create ire")
	ire <- subset(nonReducedTable, toupper(IDENTIFIER) %in% commonTopExpGenes)
	print("created ire")
	print(" --- length(ire) --- ")	
	print(length(ire))	

	print("about to print ire")
	print(ire)
	
	# Collapse the expressions values of all IDs corresponding to a single gene
	#	in each experiment to get one value for each gene for each sample
	
	collapsedIRE <- ire
	#collapsedIRE <- nonReducedTable
	
	genesAlreadyVisited <- rep(NA, 1)
	gav = 1 # Index of genesAlreadyVisited
	
	# Go through each gene symbol and generate a list of all expression values for each sample
	for (gene in collapsedIRE[,1]) {
		if (!(gene %in% genesAlreadyVisited)) {
			
			rowIndices <- which(collapsedIRE[,1]==gene) # Row indices of this gene symbol
			maxExpVals <- rep(NA, 1) # List that holds gene's max expression values for each sample
			mev = 1 # Index of maxExpVals
			
			# Go through each sample and determine its max expression value for this gene, and add to the list
			for (sample in names(ire[2:length(ire)])) {
#			for (sample in names(ire[threshold_start_ire:length(ire)])) {
				
				expVals <- as.numeric(ire[[sample]][rowIndices]) # List of expression values
				maxExpVal <- max(expVals)
				
				maxExpVals[mev] <- maxExpVal
				mev = mev + 1
			}
			
			# A list of boolean values that represents each row of the IRE table
			# TRUE if the row corresponds to this gene, FALSE otherwise
			# Will delete the rows that are FALSE except for the first one, which will be modified 
			#	to hold the new list of max expression values for each sample for this gene symbol
			boolList <- !(collapsedIRE[,1]==gene)
			boolList[rowIndices[1]] <- TRUE
			
			collapsedIRE[rowIndices[1], 2:length(collapsedIRE)] <- maxExpVals
#			collapsedIRE[rowIndices[1], threshold_start_ire:length(collapsedIRE)] <- maxExpVals
			collapsedIRE <- collapsedIRE[boolList,]
			
			genesAlreadyVisited[gav] <- gene
			gav = gav + 1
			
		}
		
	}
	
	# Convert all gene symbols to upper case
	collapsedIRE[["IDENTIFIER"]] <- toupper(collapsedIRE[["IDENTIFIER"]])
	
	listOfIREs[[id]] <- collapsedIRE # Add to list of IREs
	
}


	
	
# Normalization
print("**Normalizing all IREs**")

# Find the median across all gene expressions across all samples in each IRE
print("**Finding medians for each experiment**")
medianList <- rep(NA, 1)
m = 1 # Index in medianList	

for (ire in listOfIREs) {
	print("Finding median for:")
	gdsName <- names(listOfIREs)[m]
	print(gdsName)
	
	mat <- as.matrix(ire[,2:length(ire)])
#	mat <- as.matrix(ire[,threshold_start_ire:length(ire)])
	#med = median(as.numeric(mat)) # Doesn't always work if there is NA in mat
	nonNAindexes <- which(!is.na(mat))
	collapsedMat <- as.numeric(mat[nonNAindexes])
	med <- median(collapsedMat)
	medianList[[gdsName]] <- med
	
	print(med)
	m = m + 1
	
}

print("Median List:")
print(medianList)



# Select one IRE as reference; for all other IREs, subtract the difference 
#	between its median and reference median from all gene expressions
print("**Normalizing IREs against Reference**")

normalizedIREs <- listOfIREs

refIREName <- names(listOfIREs)[1]
refIRE <- listOfIREs[[refIREName]]
refMed <- medianList[[refIREName]]

print("Reference IRE:")
print(refIREName)
print("Reference IRE's median:")
print(refMed)

p = 1 # Index of listOfIREs / medianList
for (ire in listOfIREs) {
	normIRE <- ire
	ireName <- names(listOfIREs)[p]
	
	if (p > 1) {
		print("Currently modifying:")
		print(ireName)
		
		ireMed <- medianList[[ireName]]
		medianDiff = abs(refMed - ireMed)
		
		for (colName in names(ire)[2:length(ire)]) {
#		for (colName in names(ire)[threshold_start_ire:length(ire)]) {
			colIndex = 1
			for (num in ire[[colName]]) {
				normIRE[[colName]][colIndex] <- abs(as.numeric(num) - medianDiff)
				colIndex = colIndex + 1
			}
			
		}
	}
	
	normalizedIREs[[ireName]] <- normIRE
	p = p + 1
	
}


#------------------------------------------------------------------------




# If we want to use all common genes, then the "commonGeneList" will be all common genes
#	Otherwise, the list will be only common top differentially expressed genes
commonGeneList <- commonTopExpGenes

# Use the genes that are on the gold standard list
#commonGeneList <- intersect(goldGenes, totalCommonGenes)

# Get expression data from each experiment for each common gene
print("**Getting expression data from each experiment and creating weka files**")

# Create new files for weka

# allexperiments_singlenet.txt

write("% Title: Aging, Homo Sapiens Singlenet", file=filenameSinglenet)
write("% Creator: Vinnie Ramesh", file=filenameSinglenet, append=TRUE)
write("%", file=filenameSinglenet, append=TRUE)
write("@RELATION infection", file=filenameSinglenet, append=TRUE)
write("", file=filenameSinglenet, append=TRUE)
write("@ATTRIBUTE class {Control,Infected}", file=filenameSinglenet, append=TRUE)
for (gene in commonGeneList) {
	str = paste("@ATTRIBUTE", gene)
	str2 = paste(str, "NUMERIC")
	write(str2, file=filenameSinglenet, append=TRUE)
}
write("", file=filenameSinglenet, append=TRUE)
write("@DATA", file=filenameSinglenet, append=TRUE)



# allexperiments.txt

write("% Title: Aging, All Species", file=filename)
write("% Creator: Vinnie Ramesh", file=filename, append=TRUE)
write("%", file=filename, append=TRUE)
write("@RELATION infection", file=filename, append=TRUE)
write("", file=filename, append=TRUE)
myString <- "@ATTRIBUTE class {Control"
for (name in usefulIDs) {
	myString = paste(myString, name, sep=",")
}
myString = paste(myString, "}", sep="")
write(myString, file=filename, append=TRUE)
for (gene in commonGeneList) {
	str = paste("@ATTRIBUTE", gene)
	str2 = paste(str, "NUMERIC")
	write(str2, file=filename, append=TRUE)
}
write("", file=filename, append=TRUE)
write("@DATA", file=filename, append=TRUE)






# Get data from normalized IREs
for (gdsName in usefulIDs) {
	print("Working on:")
	print(gdsName)
	
	controlData <- list()
	nonControlData <- list()
	nonControlDataExperiments <- list()
	
	#diffExpGenes <- geneLists[[gdsName]]
	normIRE <- normalizedIREs[[gdsName]]
	
	colNumber = 2

	for (sample in names(normIRE)[2:length(normIRE)]) {
#	for (sample in names(normIRE)[threshold_start_ire:length(normIRE)]) {
		expVals <- list()
		if (sample %in% controlList) expVals <- rep("Control", 1)
		else expVals <- rep("Infected", 1)
		
		expValsExperiments <- rep(gdsName, 1)
		
		expValsIndex = 2
		expValsExperimentsIndex = 2
		
		for (geneSym in commonGeneList) {
						
			expVal <- as.numeric(normIRE[toupper(normIRE[,1])==geneSym, colNumber])
			# If the gene is not part of this experiment, make its "expVal" zero
			if (!(geneSym %in% toupper(normIRE[["IDENTIFIER"]]))) expVal = 0
			if (is.na(expVal)) expVal = 0

			print("-- gds name --")
			print(gdsName)
			print("--- original expVal  ---")
			print(expVal)
#############################

			if (expVal <= refMed) {
			expVal = 0
#				print("turning into 0 !!!")
			}
			else {
				expVal = 1 
#				print("turning into 1 !!!")
			}
	#		print("--- new expVal ---")
	#		print(expVal)
############################
			
			expVals[expValsIndex] <- expVal
			expValsIndex = expValsIndex + 1
				
			expValExperiments <- expVal
			expValsExperiments[expValsExperimentsIndex] <- expValExperiments
			expValsExperimentsIndex = expValsExperimentsIndex + 1

		}
		

		if (sample %in% controlList) {
			controlData[[sample]] <- expVals
			print("---[[sample]]---")
			print(sample)
			print("---controlData[[sample]]---")
			print(controlData[[sample]])
		}
		else {
			nonControlData[[sample]] <- expVals
			nonControlDataExperiments[[sample]] <- expValsExperiments
		}
		colNumber = colNumber + 1
		
	
	}
	
	for (controlVals in controlData) {
		print("refMed")
		print(refMed)
		print("controlVals")
		print(controlVals)

#		if (controlVals <= refMed) {
#			binarized_controlVals = 0
#			print("turning into 0 !!!")
#		}
#		else {
#			binarized_controlVals = 1 
#			print("turning into 1 !!!")
#		}
		
		write(controlVals, file=filenameSinglenet, append=TRUE, sep=",", ncolumns=length(controlVals))
		write(controlVals, file=filename, append=TRUE, sep=",", ncolumns=length(controlVals))

#		write(binarized_controlVals, file=filenameSinglenet, append=TRUE, sep=",", ncolumns=length(controlVals))
#		write(binarized_controlVals, file=filename, append=TRUE, sep=",", ncolumns=length(controlVals))
	}
	for (nonControlVals in nonControlData) {
		print("refMed")
		print(refMed)
		print("nonControlVals")
		print(nonControlVals)

#		if (nonControlVals <= refMed) {
#			binarized_nonControlVals = 0
#			print("turning into 0 !!!")
#		}
#		else {
#			binarized_nonControlVals = 1 
#			print("turning into 1 !!!")
#		}

		write(nonControlVals, file=filenameSinglenet, append=TRUE, sep=",",ncolumns=length(nonControlVals))
#		write(binarized_nonControlVals, file=filenameSinglenet, append=TRUE, sep=",",ncolumns=length(nonControlVals))
	}
	for (vals in nonControlDataExperiments) {
		write(vals, file=filename, append=TRUE, sep=",",ncolumns=length(vals))
	}
	
}

#percentTopGenes = percentTopGenes + 4
#if (percentTopGenes > 5) percentTopGenes = percentTopGenes + 1
# end WHILE loop
#}

#------------------------------------------------------------------------

# Make a table of the p-values for all common genes for each experiment
if (!(useTotalCommonGenes)) {
print("Getting p-values")
listOfPValues <- list()

for (gdsName in names(listOfTabd)) {
	tabd <- listOfTabd[[gdsName]]
	geneSymbols <- listOfDiffExpGeneLists[[gdsName]]
	
	geneIndexes <- as.integer(row.names(tabd))
	
	# Get the gene indexes of common genes
	indexesOfCommonGenes <- rep(NA, 1)
	gi = 1 # Index of geneIndexes
	cg = 1 # Index of indexesOfCommonGenes
	
	geneSymAlreadyVisited <- rep(NA, 1)
	gsav = 1
	for (sym in geneSymbols) {
		geneInd <- geneIndexes[gi]
		if ((sym %in% commonGeneList) && (!(sym %in% geneSymAlreadyVisited))) {
			indexesOfCommonGenes[cg] <- geneInd
			cg = cg + 1
		}
		
		geneSymAlreadyVisited[gsav] <- sym
		gsav = gsav + 1
		gi = gi + 1
	}
	
	# Get the p-values of each common gene
	pValues <- rep(NA, 1) 
	pv = 1 # Index of pValues
	for (num in indexesOfCommonGenes) {
		colNum <- length(tabd) - 2
		pval <- tabd[as.character(num), colNum]
		pValues[pv] <- pval
		pv = pv + 1
	}
	
	listOfPValues[[gdsName]] <- pValues
}

if (displayPValues) print(listOfPValues)
}


