# This pipeline has been modified slightly from what is described below
# It now involves manual specification of the gene id column as well as the phenotype column names,
# but it is now designed to take in GSE files instead of GDS files
# Backups of files will be created in the "./DAT" directory (from wherever you are currently running the script from)
#     -Johnny Ho
#
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

library(GEOquery)
library(limma)

# Constant variables used throughout the program

expName = "all_ment" # title when writing files

percentTopGenes = 100 # percent of topTable genes

useTargetGenes = FALSE # If true, will take intersection beween genes and list of target genes
displayPValues = FALSE # If true, will print out p-values at the end

if (useTargetGenes) {
	expName = paste0(expName, "_targ")
}

# Target genes
# targetGenes <- c("ADH1B","ADORA2A","ADRA1A","ADRA2A","ADRA2C","AGT","AR","BDNF","CDH13","CHRNA4","CHRNA7","CNR1","COMT","CTNNA2","CYP2A6","CYP2D6","DBH","DDC","DNM1","DRD1","DRD2","DRD3","DRD4","DRD5","GDNF","GRIN1","GRIN2A","HCRT","HNMT","HTR1A","HTR1B","HTR1E","HTR2A","HTR2C","IL6","INS","LIG4","MAOA","MAOB","MAP1B","MOBP","NGF","NGFR","NOS1","NT3","NTF3","NTRK2","NTRK3","NR4A2","OXTR","PAWR","PNMT","POMC","PRKG1","PRL","S100B","ATXN1","SLC1A1","SLC6A1","SLC6A2","SLC6A3","SLC6A4","SNAP25","SYP","TACR1","TH","TNF","TPH1","YWHAZ","KALRN","HTR3B","FADS2","PTPRU","GPC6","NET1","CELF2","NRG3","MYT1L","ASTN2","LPHN3","CALY","GPR85","RBFOX1","CSMD2","XKR4","TPH2","DYX1C1","ANKK1","FAM190A","FAM155A","ADHD1")

# All GSE IDs related to the disease
vIDs <- c(
	"GSE5388", # bipolar
	# "GSE23848", # bipolar
	"GSE1297", # alzheimer
	# "GSE4757", # alzheimer
	"GSE7621", # parkinson
	# "GSE20168", # parkinson
	"GSE12654", # currently set up for depression
	# "GSE32280", # depression
	# "GSE19738", # depression
	"GSE4036" # schizophrenia
	# "GSE38481" # schizophrenia
	# "GSE38484" # schizophrenia
	# "GSE29555" # alcoholism
)

# enter GSE IDs here, e.g.: c("GSE111", "GSE222", "GSE333")
#"GDS3539,GDS2611,GDS2518"
#"GDS3705,GDS3483,GDS3356,GDS2866,GDS2143,GDS2142,GDS1673,GDS1436,GDS1304,GDS1252,GDS737,GDS534,GDS289,GDS251,GDS240"
#"GDS2866,GDS1436,GDS1304,GDS737,GDS534,GDS289"
#"GDS3548,GDS1874,GDS1269,GDS670,GDS244"

# List of Phenotype Column tags - used to differentiate between differing samples
pcTags <- list()
# e.g. pcTags[["GSE111"]] <- "type"
# contains the word "control" in it
pcTags[["GSE5388"]] <- "characteristics_ch1"
pcTags[["GSE5389"]] <- "characteristics_ch1"
pcTags[["GSE23848"]] <- "characteristics_ch1"
pcTags[["GSE6264"]] <- "characteristics_ch1"
pcTags[["GSE20568"]] <- "characteristics_ch1"
pcTags[["GSE9058"]] <- "characteristics_ch1"
pcTags[["GSE32280"]] <- "characteristics_ch1.2"
pcTags[["GSE29555"]] <- "source_name_ch1"
pcTags[["GSE4036"]] <- "title"
pcTags[["GSE4229"]] <- "characteristics_ch1"
pcTags[["GSE17913"]] <- "source_name_ch1"
pcTags[["GSE19112"]] <- "title"
pcTags[["GSE37263"]] <- "characteristics_ch1.3"
pcTags[["GSE28146"]] <- "characteristics_ch1.2"
pcTags[["GSE1297"]] <- "title"
pcTags[["GSE23290"]] <- "title"
pcTags[["GSE7621"]] <- "characteristics_ch1"
pcTags[["GSE38484"]] <- "source_name_ch1"
pcTags[["GSE38481"]] <- "source_name_ch1"
pcTags[["GSE20291"]] <- "characteristics_ch1"
pcTags[["GSE19738"]] <- "title"
pcTags[["GSE21592"]] <- "characteristics_ch1.2"
pcTags[["GSE4757"]] <- "title"
pcTags[["GSE20168"]] <- "characteristics_ch1"
pcTags[["GSE12654"]] <- "title"

# List of Gene ID Column tags - used to extract ids - must be consistent between experiments
gcTags <- list()
# e.g. pcTags[["GSE111"]] <- "Gene Symbol"
# gene symbols
gcTags[["GSE5388"]] <- "Gene Symbol"
gcTags[["GSE5389"]] <- "Gene Symbol"
gcTags[["GSE23848"]] <- "Symbol"
gcTags[["GSE6264"]] <- "Gene_Symbol"
gcTags[["GSE20568"]] <- "GB_ACC"
gcTags[["GSE9058"]] <- "Gene Symbol"
gcTags[["GSE32280"]] <- "Gene Symbol"
gcTags[["GSE29555"]] <- "Symbol"
gcTags[["GSE4036"]] <- "Gene Symbol"
gcTags[["GSE4229"]] <- "GENE_SYMBOL"
gcTags[["GSE17913"]] <- "Gene Symbol"
gcTags[["GSE19112"]] <- "ORF"
gcTags[["GSE37263"]] <- "GB_LIST"
gcTags[["GSE28146"]] <- "Gene Symbol"
gcTags[["GSE1297"]] <- "Gene Symbol"
gcTags[["GSE23290"]] <- "GB_LIST"
gcTags[["GSE7621"]] <- "Gene Symbol"
gcTags[["GSE38484"]] <- "Symbol"
gcTags[["GSE38481"]] <- "Symbol"
gcTags[["GSE20291"]] <- "Gene Symbol"
gcTags[["GSE19738"]] <- "GENE_SYMBOL"
gcTags[["GSE21592"]] <- "Gene Symbol"
gcTags[["GSE4757"]] <- "Gene Symbol"
gcTags[["GSE20168"]] <- "Gene Symbol"
gcTags[["GSE12654"]] <- "Gene Symbol"

# gcTags[["GSE5388"]] <- "ENTREZ_GENE_ID"
# gcTags[["GSE1297"]] <- "ENTREZ_GENE_ID"
# gcTags[["GSE7621"]] <- "ENTREZ_GENE_ID"
# gcTags[["GSE12654"]] <- "ENTREZ_GENE_ID"
# gcTags[["GSE4036"]] <- "ENTREZ_GENE_ID"
# gcTags[["GSE29555"]] <- "Entrez_Gene_ID"

alreadyLog2 <- c("GSE19112", "GSE32280", "GSE38484", "GSE38481", "GSE20291", "GSE19738", "GSE20168", "GSE29555")

# Construct file names
print(paste("***START", expName, "using top", percentTopGenes, "percent***"))
name1 = paste0(expName, "_singlenet_", percentTopGenes, sep="")
filenameSinglenet = paste0(name1, "percent.txt")
name2 = paste0(expName, "_", percentTopGenes)
filename = paste0(name2, "percent.txt")

#------------------------------------------------------------------------

# List of GSEs, pheno, geno tables
gseList <- list()
phenoList <- list()
datList <- list()

dir.create("./DAT")
# Iterate through all of the IDs
for (id in vIDs) {
	print(id)
	
	# Check and load/save backup
	bakpath <- paste0("./DAT/", id, ".bak")
	if (file.exists(bakpath)) {
		print("Reading from backup...")
		load(bakpath)
	} else {
		datpath <- paste0("./DAT/", id, "_series_matrix.txt.gz")
		if (file.exists(datpath)) {
			print("Extracting from series matrix...")
			gse <- getGEO(id, filename = datpath, destdir = "./DAT", GSEMatrix = TRUE)
		} else {
			print("Downloading from server...")
			gse <- getGEO(id, destdir = "./DAT", GSEMatrix = TRUE)[[1]]
		}
		save(gse, file = bakpath)
	}
	gseList[[id]] <- gse
	phenoList[[id]] <- pData(gse)
	geno <- pData(featureData(gse))
	genoTag <- gcTags[[id]]
	if (!(genoTag %in% names(geno))) {
		print("**ERROR: Invalid geno tag**")
		q()
	}
	gcol <- geno[[genoTag]]
	ids <- toupper(as.character(gcol))
	gcol <- as.factor(as.character(gsub("[-]", "", lapply(strsplit(ids, "[,. ]"), function(x) x[1])))) # take first section of gene, remove dashes
	# Construct a usable table by augmenting with an IDENTIFIER
	dat <- data.frame(exprs(gse))
	if (!(id %in% alreadyLog2)) {
		print("Applying log")
		dat <- log2(dat)
	}
	dat$IDENTIFIER <- gcol # add IDENTIFIER column
	dat <- dat[!is.na(dat$IDENTIFIER),] # erase unidentified genes
	dat <- dat[dat$IDENTIFIER != "NA",]
	dat <- dat[complete.cases(dat),] # remove genes with NAs
	# show(dat$IDENTIFIER)
	dat <- dat[,c(length(dat), 1:(length(dat)-1))] # move IDENTIFIER column to 1st column
	datList[[id]] <- dat
}

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
for (id in vIDs) {
	listOfGeneLists[[id]] <- unique(datList[[id]][,1])
}

print("Length of each gene list:")
for (gl in listOfGeneLists) {
	print(length(gl))
}

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
	} else {
		# If only one gene list or on first gene list, then totalCommonGenes will be this whole list
		totalCommonGenes <- gl
	}
	k = k + 1
}

if (useTargetGenes) {
	totalCommonGenes <- intersect(targetGenes, totalCommonGenes)
}

print(paste("Number of total common genes: ", length(totalCommonGenes)))

#------------------------------------------------------------------------



# Merge all samples for control - create two lists, one to hold all the samples that
#	correspond to control and one for non-control
# Also create a list that holds each noncontrol sample's corresponding experiment tag
print("**Merging samples for control vs. noncontrol**")

controlKeywords <- c("normal", "control", "uninfected", "no cancer", "no abuse", "non smoking non alcoholic", "never", "s_le1")
forbidKeywords <- c("-LPS-", "schizophrenia, BA10-", "bipolar disorder, BA10-")
invertIDs <- c("GSE4036")

controlList <- rep(NA, 1)
cl = 1 # Index of controlList

nonControlList <- rep(NA, 1)
ncl = 1 # Index of nonControlList

expList <- list() # Type of experiment
experimentTagList <- rep(NA, 1)

# Go through each experiment
for (id in vIDs) {
	print("Currently working on:")
	print(id)
	
	pheno <- phenoList[[id]]
	gsms <- row.names(pheno)
	
	phenoTag <- pcTags[[id]]
	
	if (!(phenoTag %in% names(pheno))) {
		print("**ERROR: Invalid pheno tag**")
		q()
	}
	
	expList[[id]] <- rep(NA, 1)
	filt <- rep(NA, 1)
	
	filt[1] <- TRUE
	
	# Go through each sample and find which are control vs. noncontrol
	p <- 1
	for (i in 1:nrow(pheno)) {
		tag <- tolower(pheno[[phenoTag]][i]) # Find the classification of the sample in the pc column
		gsm <- gsms[i]
		
		forbid <- FALSE
		for (opt in tolower(forbidKeywords)) {
			if (length(grep(opt, tag, fixed = TRUE) != 0)) {
				forbid <- TRUE
				break
			}
		}
		filt[i + 1] <- !forbid
		if (forbid) next
		
		found <- FALSE
		for (opt in tolower(controlKeywords)) {
			if (length(grep(opt, tag, fixed = TRUE) != 0)) {
				found <- TRUE
				break
			}
		}
		
		if (id %in% invertIDs) {
			found <- !found
		}
		
		if (found) {
			expList[[id]][p] <- "CONTROL"
			
			controlList[cl] <- gsm
			cl = cl + 1
			
		} else {
			expList[[id]][p] <- "EXPERIMENTAL"
			
			nonControlList[ncl] <- gsm
			ncl = ncl + 1
			
			experimentTagList[[gsm]] <- phenoTag
		}
		p <- p + 1
	}
	datList[[id]] <- datList[[id]][,filt]
}

print("Control samples:")
print(controlList)
print("Noncontrol samples:")
print(nonControlList)
# print("Experiment tags of noncontrol samples:")
# print(experimentTagList)



#------------------------------------------------------------------------

# Find differentially expressed genes for each experiment

print("**Finding differentially expressed genes for each experiment**")

listOfDiffExpGeneLists <- list() # Holds each GDS's differentially expressed genes

if (percentTopGenes == 100) { # If we want ALL GENES
	for (id in vIDs) {
		print("Currently working on:")
		print(id)
		
		dat <- datList[[id]]
		listOfDiffExpGeneLists[[id]] <- dat[,1]
	}
} else {
	listOfTabd <- list() # Holds each GDS's topTable

	for (id in vIDs) {
		print("Currently working on:")
		print(id)
		
		dat <- datList[[id]]
		
		numTopGenes <- ceiling(nrow(dat) * percentTopGenes / 100)
		
		# Find top differentially expressed genes using topTable
		design <- model.matrix(~factor(expList[[id]]))
		fit <- eBayes(lmFit(dat[,2:length(dat)], design))
		
		# Get gene indexes of top differentially expressed genes
		tabd <- topTable(fit, coef=2, adjust="fdr", n=numTopGenes)
		geneIndexes <- as.integer(row.names(tabd))
		
		# Get corresponding gene IDs
		geneIDs <- dat[geneIndexes,1]
		
		listOfDiffExpGeneLists[[id]] <- as.character(unique(geneIDs))
		listOfTabd[[id]] <- tabd
	}
}

# Finds the common top differentially expressed genes
print("**Finding common top differentially expressed genes across all experiments**")
commonTopExpGenes <- rep(NA, 1)

# Compare each list to each one and find all common genes
k = 1 # Index in listOfGeneLists
for (gl in listOfDiffExpGeneLists) {
	if (k > 1) {
		commonTopExpGenes <- intersect(gl, commonTopExpGenes)
	} else {
		# If only one gene list or on first gene list
		commonTopExpGenes <- gl 
	}
	k = k + 1
}

if (useTargetGenes) {
	commonTopExpGenes <- intersect(targetGenes, commonTopExpGenes)
}

print(paste("Number of common top differentially expressed genes:", length(commonTopExpGenes)))
print(commonTopExpGenes)

# ------------------------------------------------------------------------

# Create each IRE, represented as a data table
print("**Creating reduced experiments (IREs)**")


listOfIREs <- list()

for (id in vIDs) {
	print("Currently creating IRE for:")
	print(id)
	
	dat <- datList[[id]]
	
	# Reduce the table based on common genes
	ire <- subset(dat, IDENTIFIER %in% commonTopExpGenes)
	
	genesAlreadyVisited <- rep(NA, 1)
	gav = 1 # Index of genesAlreadyVisited
	
	# Go through each gene symbol and generate a list of all expression values for each sample
	for (gene in commonTopExpGenes) {
		rowIndices <- which(ire[,1] == gene) # Row indices of this gene symbol
		
		combExpVals <- rep(NA, 1) # List that holds gene's combined expression values for each sample
		mev = 1 # Index of maxExpVals
		
		# Go through each sample and determine its combined expression value for this gene, and add to the list
		for (samp in names(ire)[2:length(ire)]) {
			
			expVals <- as.numeric(ire[[samp]][rowIndices]) # List of expression values
			combExpVal <- max(expVals)
			
			combExpVals[mev] <- combExpVal
			mev = mev + 1
		}
		
		# A list of boolean values that represents each row of the IRE table
		# TRUE if the row corresponds to this gene, FALSE otherwise
		# Will delete the rows that are FALSE except for the first one, which will be modified 
		# to hold the new list of combined expression values for each sample for this gene symbol
		boolList <- ire[,1] != gene
		boolList[rowIndices[1]] <- TRUE
		
		ire[rowIndices[1], 2:length(ire)] <- combExpVals
		ire <- ire[boolList,]
	}
	
	listOfIREs[[id]] <- ire # Add to list of IREs
}

# Normalization
print("**Normalizing all IREs**")

# Find the median across all gene expressions across all samples in each IRE
print("**Finding medians for each experiment**")
medianList <- list()
sdList <- list()

m = 1 # Index of listOfIREs
for (ire in listOfIREs) {
	print("Finding median for:")
	id <- names(listOfIREs)[m]
	print(id)
	
	mat <- as.matrix(ire[,2:length(ire)])
	nonNAindexes <- which(!is.na(mat))
	collapsedMat <- as.numeric(mat[nonNAindexes])
	
	mea <- mean(collapsedMat)
	print(paste("Mean: ", mea))
	
	med <- median(collapsedMat)
	medianList[[id]] <- med
	print(paste("Median: ", med))
	
	stddev <- sd(collapsedMat)
	sdList[[id]] <- stddev
	print(paste("Stddev: ", stddev))
	
	m = m + 1
}

# Normalize each IRE
print("**Normalizing IREs**")

normalizedIREs <- listOfIREs

p = 1 # Index of listOfIREs
for (ire in listOfIREs) {
	normIRE <- ire
	id <- names(listOfIREs)[p]
	
	print("Currently modifying:")
	print(id)
	
	med <- medianList[[id]]
	stddev <- sdList[[id]]
	
	normIRE[,2:length(normIRE)] <- (normIRE[,2:length(normIRE)] - med) / stddev
	
	normalizedIREs[[id]] <- normIRE
	p = p + 1
}

# ------------------------------------------------------------------------

commonGeneList <- commonTopExpGenes

# Get expression data from each experiment for each common gene
print("**Getting expression data from each experiment and creating weka files**")

# Create new files for weka


print("**Writing headers**")
# allexperiments_singlenet.txt

# write("% Title: TEST Singlenet", file=filenameSinglenet)
# write("% Creator: Johnny Ho", file=filenameSinglenet, append=TRUE)
# write(paste("%", vIDs), file = filenameSinglenet, append = TRUE)
# write(paste("%", Sys.time()), file=filenameSinglenet, append=TRUE)
# write("%", file=filenameSinglenet, append=TRUE)
# write("@RELATION infection", file=filenameSinglenet, append=TRUE)
# write("", file=filenameSinglenet, append=TRUE)
# write("@ATTRIBUTE class {Control,Infected}", file=filenameSinglenet, append=TRUE)
# for (gene in commonGeneList) {
	# str = paste("@ATTRIBUTE", gene)
	# str2 = paste(str, "NUMERIC")
	# write(str2, file=filenameSinglenet, append=TRUE)
# }
# write("", file=filenameSinglenet, append=TRUE)
# write("@DATA", file=filenameSinglenet, append=TRUE)


# allexperiments.txt

write(paste("% Title:", expName), file=filename)
write("% Creator: Johnny Ho", file=filename, append=TRUE)
write(paste("%", vIDs), file = filename, append = TRUE)
write(paste("%", Sys.time()), file=filename, append=TRUE)
cat("% c(\"", file = filename, append = TRUE)
cat(commonTopExpGenes, file = filename, sep = "\",\"", append = TRUE, ncolumns = length(commonTopExpGenes))
cat("\")\n", file = filename, append = TRUE)
write("%", file=filename, append=TRUE)
write("@RELATION infection", file=filename, append=TRUE)
write("", file=filename, append=TRUE)
myString <- "@ATTRIBUTE class {Control"
for (name in vIDs) {
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

print("**Writing data**")

# Get data from normalized IREs
for (id in vIDs) {
	print("Working on:")
	print(id)
	
	controlData <- list()
	nonControlData <- list()
	nonControlDataExperiments <- list()
	
	# diffExpGenes <- geneLists[[id]]
	normIRE <- normalizedIREs[[id]]
	
	colNumber = 2

	for (samp in names(normIRE)[2:length(normIRE)]) {
		expVals <- list()
		if (samp %in% controlList) {
			expVals <- rep("Control", 1)
		} else {
			expVals <- rep("Infected", 1)
		}
		expValsExperiments <- rep(id, 1)
		
		expValsIndex = 2
		expValsExperimentsIndex = 2
		
		
		for (geneSym in commonGeneList) {
			expVal <- as.numeric(normIRE[normIRE[,1]==geneSym, colNumber])
			
			expVals[expValsIndex] <- expVal
			expValsIndex = expValsIndex + 1
			
			expValExperiments <- expVal
			expValsExperiments[expValsExperimentsIndex] <- expValExperiments
			expValsExperimentsIndex = expValsExperimentsIndex + 1
		}
		
		if (samp %in% controlList) {
			controlData[[samp]] <- expVals
		} else {
			nonControlData[[samp]] <- expVals
			nonControlDataExperiments[[samp]] <- expValsExperiments
		}
		colNumber = colNumber + 1
	}
	
	print("Writing:")
	print(id)
	
	for (controlVals in controlData) {
		# write(controlVals, file=filenameSinglenet, append=TRUE, sep=",", ncolumns=length(controlVals))
		write(controlVals, file=filename, append=TRUE, sep=",", ncolumns=length(controlVals))
	}
	# for (nonControlVals in nonControlData) {
		# write(nonControlVals, file=filenameSinglenet, append=TRUE, sep=",", ncolumns=length(nonControlVals))
	# }
	for (vals in nonControlDataExperiments) {
		write(vals, file=filename, append=TRUE, sep=",", ncolumns=length(vals))
	}
	
}

# ------------------------------------------------------------------------

# Make a table of the p-values for all common genes for each experiment
if (displayPValues) {
	print("Getting p-values")
	for (id in names(listOfTabd)) {
		print("Getting:")
		paste(id)
		
		tabd <- listOfTabd[[id]]
		geneSymbols <- listOfDiffExpGeneLists[[id]]
		
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
		
		print(pValues)
	}
}
