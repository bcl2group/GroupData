library(GEOquery)
library(limma)

# Brief snippet for examining GSEs
#    -Johnny Ho

idgse <- "GSE29555" # enter id here

print(idgse)
# Check and load/save backup
dir.create("./DAT")
bakpath <- paste0("./DAT/", idgse, ".bak")
if (file.exists(bakpath)) {
	print("Reading from backup...")
	load(bakpath)
} else {
	datpath <- paste0("./DAT/", idgse, "_series_matrix.txt.gz")
	if (file.exists(datpath)) {
		print("Extracting from series matrix...")
		gse <- getGEO(idgse, filename = datpath, destdir = "./DAT", GSEMatrix = TRUE)
	} else {
		print("Downloading from server...")
		gset <- getGEO(idgse, destdir = "./DAT", GSEMatrix = TRUE)
		print(paste("Contains", length(gset), "GSE"))
		gse <- gset[[1]]
	}
	save(gse, file = bakpath)
}
pheno <- pData(gse)
print(row.names(pheno))
print(names(pheno))
write.table(pheno, file = paste0(idgse, "_pheno.csv"), sep = ",", row.names = FALSE)
geno <- pData(featureData(gse))
print(names(geno))
write.table(geno, file = paste0(idgse, "_geno.csv"), sep = ",", row.names = FALSE)
dat <- data.frame(exprs(gse))

# idgds <- "GDS2190"
# gds <- getGEO(idgds, destdir = "./DAT")
# eset <- GDS2eSet(gds, do.log2=TRUE)
# gdssamp <- pData(eset)
# gdsdat <- exprs(eset)
# tab <- Table(gds)
