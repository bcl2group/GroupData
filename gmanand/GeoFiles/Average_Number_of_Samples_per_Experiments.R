


############ Counting the number of samples in GEO
############ Written by: Amin Zollanvari March/2/2012



#Unzipping...
#Metadata associate with downloaded file:
#                name               value
#1     schema version                 1.0
#2 creation timestamp 2012-03-03 05:17:58
#"/Users/aminzollanvari/GEOmetadb.sqlite"


source("http://bioconductor.org/biocLite.R")

biocLite("GEOmetadb")

library(GEOmetadb)



# connect to database

getSQLiteFile()

con <- dbConnect(SQLite(), "GEOmetadb.sqlite")

gds.count <- dbGetQuery(con, "select gds,sample_count from gds")

gds.count <- dbGetQuery(con, "select gds,sample_count from gds")


gds.count[1:5,]

 #dbListTables(con)
 #OUTput
 #"gds"               "gds_subset"        "geoConvert"        "geodb_column_desc"
 #"gpl"               "gse"               "gse_gpl"           "gse_gsm"          
# "gsm"               "metaInfo"          "sMatrix"        


#To get the columns in con SQLite:

columnDescriptions(sqlite_db_name='GEOmetadb.sqlite')


#Then:

gds.count.year <- dbGetQuery(con, "select gds,sample_count, update_date from gds")


Year=strsplit(gds.count.year[,3],split="-")
Yearvec=numeric(0)
for (i in 1:2721){
Yearvec=c(Yearvec,Year[[i]][1])	
}
Yearvec=as.numeric(Yearvec)
gds.count.year[,3]=Yearvec

median(gds.count.year[which(Yearvec>=2006),2])
median(gds.count.year[which(Yearvec<2006),2])








