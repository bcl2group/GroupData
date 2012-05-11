library(GEOquery);

# Directory where disease to GDS mappings are saved
setwd("/Users/pengpc/Documents/D/HST/111022")

# User requests disease and species
#	HIV, All species in this example

# First we need to get all the GDS IDs related to the disease
diseaseTable <- read.table("All_diseasesToGDSIDs.txt", sep="\t", header=TRUE)
ids <- diseaseTable[diseaseTable[,1]=="Ischemia",2]

# Create a table that holds all the IDs
s <- c(as.character(ids))
t <- read.csv(textConnection(s), header=FALSE)
close(textConnection(s))

# Create a vector that holds the IDs
vectorIDs <- rep(NA, 1)
index = 1
for (id in t) {
	vectorIDs[index] <- as.character(id)
	index <- index+1
}

# Create a vector that will hold the experiments (GDS IDs) that we will want
#	to use in the next part of the pipeline
# Also create a list to hold all the "PC" column tags
usefulIDs <- rep(NA, 1)
u = 1 # Index of usefulIDs
pcTags <- rep(NA, 1)

# A list that holds all the keywords related to control
controlKeywords <- c("normal","Normal","NORMAL","control","Control","CONTROL","control subject",
		"Control subject","Control Subject","CONTROL SUBJECT","uninfected","Uninfected","UNINFECTED",
		"untreated","Untreated","UNTREATED","no cancer","No cancer","No Cancer","NO CANCER")

# Iterate through all of the IDs
for (id in vectorIDs) {
	print(id)
	gds <- getGEO(id)
	eset <- GDS2eSet(gds, do.log2=TRUE)
	pData <- pData(eset)
	
	print(pData)
	
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


# The list of "interesting" experiments from the 1st half of the pipeline and PC Tags
#	This example is from HIV (All species)
#interestingExperiments <- c("GDS1453", "GDS1580", "GDS1646", "GDS1726", "GDS2168", "GDS2883")
interestingExperiments <- usefulIDs

# Finds the platform of each experiment and stores them in a list
print("**Getting platforms for each experiment**")
platforms <- rep(NA, 1)
i = 1 # Index of list platforms
for (id in interestingExperiments) {
	gds <- getGEO(id)
	pl <- Meta(gds)$platform
	if (!(pl %in% platforms)) {
		platforms[i] <- pl
		i = i + 1	
	}
}

print("Platforms:")
print(platforms)


# Gets all genes across these platforms in Gene Symbol format
print("**Getting all genes for each platform**")
listOfGeneLists <- list()
j = 1 # Index of list listOfGeneLists
for (p in platforms) {
	gpl <- getGEO(p)
	geneSymbols <- levels(Table(gpl)$Gene.Symbol)
	listOfGeneLists[[j]] <- geneSymbols
	j = j + 1
}
print("Length of each gene list:")
for (l in listOfGeneLists) print(length(l))

#------------------------------------------------------------------------


# Finds the intersection of all genes across all these platforms
print("**Finding intersection of genes across all platforms**")
commonGenes <- rep(NA, 1)

# Compare each list to each one and find all common genes
# First compare first and second list and find commonGenes
#	Then compare third list to commonList to make new commonGenes
#	Continue until final list is reached; then commonGenes will have all common genes
k = 1 # Index in listOfGeneLists
for (gl in listOfGeneLists) {
	if (k > 1) {
		commonGenes <- intersect(gl, commonGenes)
	}
	# If only one gene list or on first gene list, then commonGenes will be this whole list
	else commonGenes <- gl 
	k = k + 1
}

print(paste("Number of common genes: ", length(commonGenes)))

#------------------------------------------------------------------------


# Create each IRE, represented as a data table
print("**Creating reduced experiments (IREs)**")
listOfIREs <- list()

for (id in interestingExperiments) {
	gds <- getGEO(id)
	nonReducedTable <- Table(gds)[,2:length(names(Table(gds)))]
	ire <- subset(nonReducedTable, IDENTIFIER %in% commonGenes)
	
	listOfIREs[[id]] <- ire # Add to list of IREs
	filename <- paste("IRE",id,".csv",sep="")
	write.csv(ire,filename)


}

#------------------------------------------------------------------------

# Normalization: Take the log2 of all gene expressions in each IRE 
print("**Normalizing all IREs**")
modifiedIREs <- listOfIREs
n = 1 # Index of modifiedIREs

for (ire in listOfIREs) {
	print("Calculating normalized values for:")
	gdsName <- names(listOfIREs)[n]
	print(gdsName)
	
	modIRE <- ire
	
	# Iterate through each column except for the first (gene symbols)
	for (sample in names(ire[,2:length(ire)])) {
		
		# Iterate through each value in the column and replace it with its log base 2
		sampleIndex = 1
		for (num in ire[[sample]]) {
			modIRE[[sample]][sampleIndex] <- log(as.numeric(num), 2)
			sampleIndex = sampleIndex + 1
			
		}
	}
	
	modifiedIREs[[gdsName]] <- modIRE
	
	n = n + 1
			
}



# Find the median across all gene expressions across all samples in each IRE
print("**Finding medians for each experiment**")
medianList <- rep(NA, 1)
m = 1 # Index in medianList	

for (modIRE in modifiedIREs) {
	print("Finding median for:")
	gdsName <- names(modifiedIREs)[m]
	print(gdsName)
	
	allValues <- rep(NA, 1) # List of all gene expression values
	av = 1 # Index of allValues
	
	# Go through each sample and add all the values to the list allValues
	for (sample in names(modIRE[,2:length(modIRE)])) {
		for (expVal in modIRE[[sample]]) {
			allValues[av] <- as.numeric(expVal)
			av = av + 1
		}
		
	}
	
	med <- median(na.omit(allValues))
	medianList[[gdsName]] <- med
	
	print(med)
	m = m + 1
	
	
}

print("Median List:")
print(medianList)


# Select one IRE as reference; for all other IREs, subtract the difference 
#	between its median and reference median from all gene expressions
print("**Normalizing IREs against Reference**")

normalizedIREs <- modifiedIREs

refIREName <- names(modifiedIREs)[1]
refIRE <- modifiedIREs[[refIREName]]
refMed <- medianList[[refIREName]]

print("Reference IRE:")
print(refIREName)
print("Reference IRE's median:")
print(refMed)

p = 1 # Index of modifiedIREs / medianList
for (modIRE in modifiedIREs) {
	normIRE <- modIRE
	ireName <- names(modifiedIREs)[p]
	
	if (p > 1) {
		print("Currently modifying:")
		print(ireName)
		
		ireMed <- medianList[[ireName]]
		medianDiff = abs(refMed - ireMed)
		
		# Go through each sample and change every expression value
		for (sample in names(modIRE[,2:length(normIRE)])) {
			newExpVals <- rep(NA, 1) # List of new expression values for this sample
			nev = 1 # Index of newExpVals
			for (expVal in modIRE[[sample]]) {
				newVal <- as.numeric(expVal) - medianDiff
				newExpVals[nev] <- newVal
				nev = nev + 1
			}
			normIRE[[sample]] <- newExpVals
			
		}
	}
	
	normalizedIREs[[ireName]] <- normIRE
	filename<-paste("normIRE",ireName,".csv",sep="")
	write.csv(normIRE,filename)
	p = p + 1
	
}

#}

#------------------------------------------------------------------------

# Merge all samples for control - create two lists, one to hold all the samples that
#	correspond to control and one for non-control
# Also create a list that holds each noncontrol sample's corresponding experiment tag
print("**Merging samples for control vs. noncontrol**")

controlKeywords <- c("normal","Normal","NORMAL","control","Control","CONTROL","control subject",
		"Control subject","Control Subject","CONTROL SUBJECT","uninfected","Uninfected","UNINFECTED",
		"untreated","Untreated","UNTREATED","no cancer","No cancer","No Cancer","NO CANCER")

controlList <- rep(NA, 1)
cl = 1 # Index of controlList

nonControlList <- rep(NA, 1)
ncl = 1 # Index of nonControlList
experimentTagList <- rep(NA, 1)

# Go through each experiment
for (id in interestingExperiments) {
	print("Currently working on:")
	print(id)
	
	gds <- getGEO(id)
	eset <- GDS2eSet(gds, do.log2 = TRUE)
	pdata <- pData(eset)
	
	pcTag <- pcTags[[id]]
	
	# Go through each sample and find which are control vs. noncontrol
	for (sample in pdata$sample) {
		print("Sample:")
		print(sample)
		
		index <- which(pdata[,1]==sample) # Find index of this sample in the whole list
		sampleTag <- pdata[[pcTag]][index] # Find the classification of the sample in the pc column
		
		if (sampleTag %in% controlKeywords) {
		
			controlList[cl] <- sample
			cl = cl + 1
			
			print("Added to control list")
		}
		else {
			nonControlList[ncl] <- sample
			ncl = ncl + 1
			
			experimentTagList[[sample]] <- pcTag
			
			print("Added to noncontrol list")
		}
	}
	
}

print("Control samples:")
print(controlList)
print("Noncontrol samples:")
print(nonControlList)
print("Experiment tags of noncontrol samples:")
print(experimentTagList)

write.csv(controlList,"IschemiaControlList.csv")
write.csv(nonControlList,"IschemiaNonControlList.csv")



######################################

library(samr)
binaryList = normalizedIREs[[names(normalizedIREs)[1]]][,1:2]
p = 1
sigGenes = c()
for (modIRE in normalizedIREs) {
    index = names(normalizedIREs)[p]
    print(index)
    nowIRE = normalizedIREs[[index]][,2:length(normalizedIREs[[index]])]
    train = nowIRE[,2:dim(nowIRE)[[2]]] 
	class=c("control","nonControl")
    dimnames(train)[[2]][colnames(train)%in%controlList[,2]] = class[1]
	dimnames(train)[[2]][colnames(train)%in%nonControlList[,2]] = class[2]
    
    tFDR = 0.05
	dd = list(x = as.matrix(train), y =as.factor(dimnames(train)[[2]]), geneid = as.character(1:nrow(train)), genenames=row.names(train), logged2=F)
    samr.obj=samr(dd, resp.type = "Two class unpaired")
    delta.table = samr.compute.delta.table(samr.obj)
    delta.table.remove = na.omit(delta.table)
    target.row = order(abs(delta.table.remove[,6]-tFDR))[1]
	
    if (delta.table.remove[target.row,4] == 1){
    	delta = delta.table.remove[(target.row-1),1]
    } else {
    	delta = delta.table.remove[target.row,1]
    }
	
    sig.table = samr.compute.siggenes.table(samr.obj,delta,dd,delta.table.remove)
    upGenes = sig.table$genes.up[,2]
    downGenes = sig.table$genes.lo[,2]
    sigGenes = c(sigGenes,upGenes,downGenes)
    binaryList = cbind(binaryList,rep(2,dim(binaryList)[[1]]))
    binaryList[upGenes,2+p] = 1
    binaryList[downGenes,2+p] = 0
    p = p+1
}
binaryList = binaryList[sigGenes,]
binaryList = binaryList[!apply(is.na(binaryList), 1, any),]
colString = c("X","IDENTIFIER")
p = 1
for (modIRE in normalizedIREs) {
    index = names(normalizedIREs)[p]
    colString = c(colString,index)
    p = p+1
}
colnames(binaryList) = colString 
write.csv(t(binaryList[,2:dim(binaryList)[[2]]]),"binaryIschemia.csv")


