#GEOpipeline Documentation

#The general purpose of this code is to use the packages in the GEO (Gene Expression Omnibus) to create 2 text files
#at the end that are able to be used by Albert's Multinet Builder java program (which uses weka). In order to run this code,
#first you’ll need to install the GEOquery so that you could use the GEO database. You could Use the biocLite.R script to install
#Bioconductor packages. To install the GEOquery package just type the following script in R:

#source("http://www.bioconductor.org/biocLite.R")
#biocLite("GEOquery")

#There’s another package you’ll need to install. This package is called “LIMMA”. LIMMA is a library for the analysis of gene expression
#microarray data, especially the use of linear models for analysing designed experiments and the assessment of differential expression.
#LIMMA provides the ability to analyse comparisons between many RNA targets simultaneously in arbitrary complicated designed experiments.
#Empirical Bayesian methods are used to provide stable results even when the number of arrays is small. The normalization and data analysis
#functions are for two-colour spotted microarrays. The linear model and differential expression functions apply to all microarrays including
#Affymetrix and other multi-array oligonucleotide experiments. 

#There are three types of documentation available. (1) The LIMMA User's Guide can be reached through the "User Guides and Package Vignettes" links at the top of the LIMMA contents page. The functionlimmaUsersGuide gives the file location of the User's Guide. (2) An overview of limma functions grouped by purpose is contained in the numbered chapters at the top of the LIMMA contents page, of which this page is the first. (3) The LIMMA contents page gives an alphabetical index of detailed help topics.
#To install limma, type the following in an R command window:
#source("http://bioconductor.org/biocLite.R")
#biocLite("limma")

#There’s another code called GetGEODescription.R which provides the IDs from vectorIDs

# This pipeline works in this structure:
# 1. Determine which experiments are "interesting" through a variety of steps
# 2. Find intersection of genes across all experiments
# 3. Determine which samples correspond to control vs. noncontrol
# 4. Find top differentially expressed genes for each experiment
# 5. Find intersection of genes among top differentially expressed genes
# 6. Create "interesting reduced experiments" (IREs), which are essentially
# data tables that represent each of the interesting experiments and their
# expression data from each GSM sample. They are "reduced" because only the data
# from the common genes is included in each data table.
# 7. Normalize IREs by using a reference IRE, finding its median, and subtracting
# the difference between the reference median and the IRE's median from each
# value in the IRE
# 8. Create ARFF files with the data from these genes

library(GEOquery)
library(limma)

# Directory where disease to GDS mappings are saved
#setwd("/Users/neenaparikh/Documents/Eclipse/R/GEOPipeline")

# First we need to get all the GDS IDs related to the disease

# Example: HIV IDs
#ids <- "GDS3592,GDS3297,GDS2975,GDS2963,GDS2785,GDS1523,GDS1381"

ids<-
#"GDS3539,GDS2611,GDS2518"
#"GDS3705,GDS3483,GDS3356,GDS2866,GDS2143,GDS2142,GDS1673,GDS1436,GDS1304,GDS1252,GDS737,GDS534,GDS289,GDS251,GDS240"
#"GDS2866,GDS1436,GDS1304,GDS737,GDS534,GDS289"
#"GDS3548,GDS1874,GDS1269,GDS670,GDS244"


# Variables used throughout the program
percentTopGenes = 25 # percent of topTable genes

displayPValues = TRUE # If true, will print out p-values at the end
useTotalCommonGenes = FALSE # If true, will use all common genes (not just top diff exp)





#------------------------------------------------------------------------------------------

# File that holds GDS titles
#fileGDStitles = "GDStitles.txt"



# Create a table that holds all the IDs

s <- c(as.character(ids)) 	# c(as.character(ids)) puts the ids into a character vector
#c() This is a generic function which combines its arguments.
t <- read.csv(textConnection(s), header=FALSE)
close(textConnection(s))

#textConnection(object, open = "r", local = FALSE, encoding = c("", "bytes", "UTF-8"))
#textConnection(s)
#s is a character. A description of the connection. Here this is an R character vector object.

#An input text connection is opened and the character vector is copied at time the connection object is created,
#and close destroys the copy. object should be the name of a character vector: however, short expressions will be accepted
#provided they deparse to less than 60 bytes.

#read.csv
#Here the data file is in the format called "comma separated values" (csv).
#That is, each line contains a row of values which are experiment IDs here,
#and each value is separated by a comma. Moreover the very first row must
#contain a list of labels. The labels in the top row are used
#to refer to the different columns of values.




# Create a vector that holds the IDs
vectorIDs <- rep(NA, 1)
vid = 1 # Index of vectorIDs
for (id in t) {
vectorIDs[vid] <- as.character(id)
vid <- vid+1
}

# Create a vector that will hold the experiments (GDS IDs) that we will want
# to use in the next part of the pipeline
# Also create a list to hold all the "PC" column tags
usefulIDs <- list()
u = 1 # Index of usefulIDs
pcTags <- list()

# A list that holds all the keywords related to control
controlKeywords <- c("normal","Normal","NORMAL","control","Control","CONTROL","control subject",
"Control subject","Control Subject","CONTROL SUBJECT","uninfected","Uninfected","UNINFECTED",
"no cancer","No cancer","No Cancer","NO CANCER")

#c() In its default mode is a generic function that combines its arguments to form a vector.

# Lists to hold all the GDS and eset (expression set object) files
gdsList <- list()
esetList <- list()

# Iterate through all of the IDs
for (id in vectorIDs) {
print(id)
gds <- getGEO(id) #download vectorIDs file put it in the current directory, and load it
eset <- GDS2eSet(gds, do.log2=TRUE) #turning GDS object into an expression set object (using base 2 logarithms)
pData <- pData(eset) #extracting the phenotype data

gdsList[[id]] <- gds
esetList[[id]] <- eset
#[[ can be applied recursively to lists. Here assuming index id is a vector of length p,
#gdsList[[id]] is equivalent to gdsList[[id1]]...[[idp]] providing all but the final indexing results in a list.

# Stores the column names in a vector
#Here names is a generic accessor function. It gets the "names" attribute of the vector (pData).
colNames <- names(pData)


# Checks if "other columns except sample and description" (OC) contain time
# If yes, go to the next experiment; if no, go on to next step
if (!("time" %in% colNames)) {
print("OC does not contain time --> go to next step")

# Checks if OC contain a column which contains either 'normal' or
# 'control' or 'uninfected' or 'no cancer'
# If yes, go on to next step; if no, go to the next experiment
ocContainsKeyword = FALSE
colsWithKeywordCount = 0
#NA is a logical constant of length 1 which contains a missing value indicator. The code below changes the status of
#all columns with keywords to be Not Available.

colsWithKeyword <- rep(NA, 1)
i = 1
#checks if "sample & description" exists in a column, if the column contains "sample or description" it will be no longer an OC column.
#If a column contains "sample o description"  ocContainsKeyword status will change to true. Also that specific column will be loaded into
#a vector called colsWithKeyword and colsWithKeywordCount will be added by one.
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
  if (colsWithKeywordCount == 1) { #if there is only one column with keyword the column will be counted as the Phenotype Column (PC).
    print ("Just one column with keywords --> save as PC and continue")
    pc <- colsWithKeyword[1]
  }
  else {
  print ("More than one column with keywords --> continue")

# Checks if more than 2 columns contain keywords.
#if more than 2 columns contain keywords, the column that contains "disease.state" will be counted as PC.
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
  #if there are exactly 2 columns containing keywords. It will assign numbers to each keywords in a vector with the same length as colsWithKeyword.
  #These numbers play a priority role so that the column with the assigned lower number will be counted as phenotype column.
  else { 
    print ("Only 2 columns with keywords --> assign numbers to each and continue.")

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
      else if (keyCol == "dose" || keyCol == "agent"|| keyCol == "genotype/variation") {
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
	# if both number assigned to colNames were equal we'll check for the specific keyword "contorl". 
	#The column that contains "control" will be counted as pc. If either or neither of them contain "control"
	#we'll assume the one with 2 factors to be the pc.
    else if (colNums[1]== colNums[2]) { 
# Column which contains "control" is PC

# If both or neither contains "control"
      if ((("control" %in% levels(pData[[colsWithKeyword[1]]]))&& ("control" %in% levels(pData[[colsWithKeyword[2]]])))|| (!("control" %in% levels(pData[[colsWithKeyword[1]]]))&& !("control" %in% levels(pData[[colsWithKeyword[2]]])))) {

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
    else { #if (colNums[1]> colNums[2])
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
else { #If PC contains only 2 factors, the id which was read from the file will be saved as a useful id in the usefulIDs vector and maps the phenotype column as the tag of that dataset. 
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
# gds <- gdsList[[gdsID]]
# title <- Meta(gds)$title
# write(paste(gdsID, title, sep = "\t"), file=fileGDStitles, append=TRUE)
#}
# Find ALL common genes across all experiments

print("**Getting all genes for each experiment**")
listOfGeneLists <- list()
for (gdsID in usefulIDs) { #Here we assign a symbol for each gene with the usefulIDs.  The symbol would be the upper case of the level of the gds.
gds <- gdsList[[gdsID]]
geneSymbols <- toupper(levels(Table(gds)[["IDENTIFIER"]]))
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
# Then compare third list to commonList to make new totalCommonGenes
# Continue until final list is reached; then totalCommonGenes will have all common genes
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
# correspond to control and one for non-control
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
# Here it gets sample of the pdata of each usefulID. After that it extracts
# the index and the tage of the sample. if the sample tag contains any of the control keywords,
# the sample will be added to the control list otherwise it will be aded to the noncontrol list. 
# Moreover it adds the pc tag to a vector called experimentTagList. this vector has the size of the sample. 
for (id in usefulIDs) { 
  print("Currently working on:")
  print(id)
  gds <- gdsList[[id]]
  eset <- esetList[[id]]
  pdata <- pData(eset)
  pcTag <- pcTags[[id]]
# Go through each sample and find which are control vs. noncontrol
  for (sample in pdata$sample) {
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
#print("Control samples:")
#print(controlList)
#print("Noncontrol samples:")
#print(nonControlList)
#print("Experiment tags of noncontrol samples:")
#print(experimentTagList)
#------------------------------------------------------------------------
#while (percentTopGenes <= 40) {





# paste converts its arguments (via as.character) to character strings, and concatenates them (separating them by the string given by sep).



print(paste("Myelitis,", percentTopGenes))
name1 = paste("Myelitis_singlenet_", percentTopGenes, sep="")
filenameSinglenet = paste(name1, "percent.txt", sep = "")
name2 = paste("Myelitis_", percentTopGenes, sep="")
filename = paste(name2, "percent.txt", sep = "")
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
# ceiling takes a single numeric argument x and returns a numeric vector
# containing the smallest integers not less than the corresponding elements of x.
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
# "strsplit(x,...)" splits the elements of a character vector x into substrings according to the matches to substring split within them.
thisStrsplit <- strsplit(geneSymbol, "")[[1]]

#grep searches for matches to argument pattern within each element of a character vector: Pattern Matching and Replacement

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
nonReducedTable <- Table(gds)[,2:length(names(Table(gds)))]
ire <- subset(nonReducedTable, toupper(IDENTIFIER) %in% commonTopExpGenes)
# Collapse the expressions values of all IDs corresponding to a single gene
# in each experiment to get one value for each gene for each sample
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
expVals <- as.numeric(ire[[sample]][rowIndices]) # List of expression values
maxExpVal <- max(expVals)
maxExpVals[mev] <- maxExpVal
mev = mev + 1
}
# A list of boolean values that represents each row of the IRE table
# TRUE if the row corresponds to this gene, FALSE otherwise
# Will delete the rows that are FALSE except for the first one, which will be modified
# to hold the new list of max expression values for each sample for this gene symbol
boolList <- !(collapsedIRE[,1]==gene)
boolList[rowIndices[1]] <- TRUE
collapsedIRE[rowIndices[1], 2:length(collapsedIRE)] <- maxExpVals
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
# between its median and reference median from all gene expressions
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
# Otherwise, the list will be only common top differentially expressed genes
commonGeneList <- commonTopExpGenes
# Use the genes that are on the gold standard list
#commonGeneList <- intersect(goldGenes, totalCommonGenes)
# Get expression data from each experiment for each common gene
print("**Getting expression data from each experiment and creating weka files**")
# Create new files for weka
# allexperiments_singlenet.txt
write("% Title: HIV, All Species Singlenet", file=filenameSinglenet)
write("% Creator: Neena Parikh", file=filenameSinglenet, append=TRUE)
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
write("% Title: HIV, All Species", file=filename)
write("% Creator: Neena Parikh", file=filename, append=TRUE)
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
expVals[expValsIndex] <- expVal
expValsIndex = expValsIndex + 1
expValExperiments <- expVal
expValsExperiments[expValsExperimentsIndex] <- expValExperiments
expValsExperimentsIndex = expValsExperimentsIndex + 1
}
if (sample %in% controlList) {
controlData[[sample]] <- expVals
}
else {
nonControlData[[sample]] <- expVals
nonControlDataExperiments[[sample]] <- expValsExperiments
}
colNumber = colNumber + 1
}
for (controlVals in controlData) {
write(controlVals, file=filenameSinglenet, append=TRUE, sep=",", ncolumns=length(controlVals))
write(controlVals, file=filename, append=TRUE, sep=",", ncolumns=length(controlVals))
}
for (nonControlVals in nonControlData) {
write(nonControlVals, file=filenameSinglenet, append=TRUE, sep=",",ncolumns=length(nonControlVals))
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