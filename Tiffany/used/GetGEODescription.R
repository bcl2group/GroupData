library(GEOquery)
library(limma)



#GDS ID's to get description for
vectorIDs <-scan("GDSIDsList.txt",what = character())


for (id in vectorIDs) {
	print(id)
	#write(id, file = "GDSDescriptions.txt", append = TRUE)
	gds <- getGEO(id)
	x<-paste(id, Meta(gds)$description[1], sep=" ")
	write(x, file = "GDSDescriptions.txt", append = TRUE)
}
