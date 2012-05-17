install.packages("gplots") #used for error bars

#access GEOmetadb

source("http://bioconductor.org/biocLite.R")
biocLite("GEOmetadb")
library(GEOmetadb)

#connect to database

getSQLiteFile()

con <- dbConnect(SQLite(), "GEOmetadb.sqlite")

#access GDS table

gds.count <- dbGetQuery(con, "select gds,sample_count from gds")
gds.count[1:5,]

#to get the columns in con SQLite:

columnDescriptions(sqlite_db_name='GEOmetadb.sqlite')

#extract sample and feature data

gds.count.year <- dbGetQuery(con, "select gds,sample_count,feature_count,update_date from gds")

#extract year value from update_date

Year=strsplit(gds.count.year[,4],split="-")
Yearvec=numeric(0)
for (i in 1:2721){
Yearvec=c(Yearvec,Year[[i]][1])	
}
Yearvec=as.numeric(Yearvec)
gds.count.year[,4]=Yearvec

#find maximum and minimum sample and feature values

max(gds.count.year[,2])
min(gds.count.year[,2])
max(gds.count.year[,3])
min(gds.count.year[,3])

#find number of datasets in each 4-year period
Data1<-gds.count.year[which(Yearvec<=2006),]
Data2<-gds.count.year[which(Yearvec>=2007),]

dim(Data1)
dim(Data2)

#store median and average sample sizes for each 4-year period
#store median and average feature sizes for each 4-year period

Values1<-c(median(Data1[,2]),median(Data1[,3]),mean(Data1[,2]),mean(Data1[,3]),median(Data1[,2]/Data1[,3]),mean(Data1[,2]/Data1[,3]))
Values2<-c(median(Data2[,2]),median(Data2[,3]),mean(Data2[,2]),mean(Data2[,3]),median(Data2[,2]/Data2[,3]),mean(Data2[,2]/Data2[,3]))

#create matrix to store median and mean values

YearSet<-c("2003-2006","2006-2010")
SFCount<-c("SampleMed","FeatureMed","SampleMean","FeatureMean","S-F.Med","S-F.Mean")
Count.GEO<-matrix(c(Values1,Values2),nrow=2,ncol=6,byrow=TRUE,dimnames=list(YearSet,SFCount))
Count.GEO

#store standard deviation and variance values for each 4-year period in a matrix

SSD.GEO<-matrix(c(sd(Data1[,2]),sd(Data2[,2])))
SVAR.GEO<-SSD.GEO*SSD.GEO
dimnames(SSD.GEO)=list(row.names(Count.GEO),"SampleStdDev")
dimnames(SVAR.GEO)=list(row.names(Count.GEO),"SampleVariance")
SSD.GEO;SVAR.GEO

FSD.GEO<-matrix(c(sd(Data1[,3]),sd(Data2[,3])))
FVAR.GEO<-FSD.GEO*FSD.GEO
dimnames(FSD.GEO)=list(row.names(Count.GEO),"FeatureStdDev")
dimnames(FVAR.GEO)=list(row.names(Count.GEO),"FeatureVariance")
FSD.GEO;FVAR.GEO

SFSD.GEO<-matrix(c(sd(Data1[,2]/Data1[,3]),sd(Data2[,2]/Data2[,3])))
SFVAR.GEO<-SFSD.GEO*SFSD.GEO
dimnames(SFSD.GEO)=list(row.names(Count.GEO),"S-F.StdDev")
dimnames(SFVAR.GEO)=list(row.names(Count.GEO),"S-F.Variance")
SFSD.GEO;SFVAR.GEO

#graph sample size and feature size over time

library(gplots)

par(mfrow=c(2,1))

plotCI(x=Count.GEO[,1],uiw=SSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.GEO[,3],uiw=SSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="4-Year Period",ylab="Samples","GEO: Mean and Median Sample Size over 4-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

plotCI(x=Count.GEO[,2],uiw=FSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50000),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.GEO[,4],uiw=FSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50000),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="4-Year Period",ylab="Features","GEO: Mean and Median Feature Size over 4-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#graph comparing samples and features over time, with error bars

library(gplots)

par(mfrow=c(2,1))

#Option 1: x = 5-Year Period, y = S-F Ratio

plotCI(x=Count.GEO[,5],uiw=SFSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.01),type="o",col="red",xlab="",ylab="")
plotCI(x=Count.GEO[,6],uiw=SFSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.01),type="o",col="blue",xlab="",ylab="",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="4-Year Period",ylab="S-F Ratio","GEO: Mean and Median Sample-Feature Ratio over 4-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#Option 2: x = Samples, y = Features

plot(Count.GEO[,1]/sd(gds.count.year[,2]),Count.GEO[,2]/sd(gds.count.year[,3]),xlim=c(0,1),ylim=c(0,2),xlab="",ylab="",type="o",col="red")
lines(Count.GEO[,3]/sd(gds.count.year[,2]),Count.GEO[,4]/sd(gds.count.year[,3]),type="o",col="blue")
title(xlab="Samples (normalized)",ylab="Features (normalized)","GEO: Feature Size vs. Sample Size over 4-Year Periods")
legend("bottomright",title="Legend",c("Median","Mean","4-Yr Period (progressing from bottom up)"),lty=c(1,1,0),lwd=c(1,1,0),pch=c(1,1,1),col=c("red","blue","black"))

#plot(Count.GEO[,1]/max(gds.count.year[,2]),Count.GEO[,2]/max(gds.count.year[,3]),xlim=c(0,0.5),ylim=c(0,0.5),xlab="",ylab="",type="o",col="red")
#lines(Count.GEO[,3]/max(gds.count.year[,2]),Count.GEO[,4]/max(gds.count.year[,3]),type="o",col="blue")
#title(xlab="Samples (normalized)",ylab="Features (normalized)","GEO: Feature Size vs. Sample Size over 4-Year Periods")
#legend("bottomright",title="Legend",c("Median","Mean","4-Yr Period (progressing from bottom up)"),lty=c(1,1,0),lwd=c(1,1,0),pch=c(1,1,1),col=c("red","blue","black"))

#To allow for statistical analysis, create matrices of equal column lengths

Svec1<-Data1[,2]
Svec2<-Data2[,2]
Fvec1<-Data1[,3]
Fvec2<-Data2[,3]

length(Svec2)=length(Svec1);length(Fvec2)=length(Fvec1)

SData.GEO<-cbind(Svec1,Svec2)
dimnames(SData.GEO)=list(NULL,NULL)
FData.GEO<-cbind(Fvec1,Fvec2)
dimnames(FData.GEO)=list(NULL,NULL)

#Fill in missing data using mean of previous values

sum(is.na(Svec2))
Svec2[is.na(Svec2)]<-mean(Svec2[!is.na(Svec2)])
sum(is.na(Fvec2))
Fvec2[is.na(Fvec2)]<-mean(Fvec2[!is.na(Fvec2)])

#Fill in missing data using median of previous values

sum(is.na(Svec2))
Svec2[is.na(Svec2)]<-median(Svec2[!is.na(Svec2)])
sum(is.na(Fvec2))
Fvec2[is.na(Fvec2)]<-median(Fvec2[!is.na(Fvec2)])

#Create vectors for S-F ratio values
SFvec1<-Svec1/Fvec1
SFvec2<-Svec2/Fvec2

#Perform student's t-test on sample data and feature data from two 4-year periods

t.test(Svec1,Svec2)
t.test(Fvec1,Fvec2)
t.test(SFvec1,SFvec2)

#Perform analysis of variance on sample data and feature data from two 4-year periods (using both fill-in methods)

aov(Svec1~Svec2)
summary(aov(Svec1~Svec2))
aov(Fvec1~Fvec2)
summary(aov(Fvec1~Fvec2))
aov(SFvec1~SFvec2)
summary(aov(SFvec1~SFvec2))

#Note: for statistical tests above, use mean fill-in, median fill-in, and no fill-in methods to account for missing values