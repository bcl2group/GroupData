install.packages("gplots") #used for error bars
install.packages("ggplot2") #can also be used for error bars, not implemented below

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

#find number of datasets in each 5-year period
Data0307<-gds.count.year[which(Yearvec>=2003 & Yearvec<=2007),]
Data0408<-gds.count.year[which(Yearvec>=2004 & Yearvec<=2008),]
Data0509<-gds.count.year[which(Yearvec>=2005 & Yearvec<=2009),]
Data0610<-gds.count.year[which(Yearvec>=2006 & Yearvec<=2010),]

length(Data0307[,1])
length(Data0408[,1])
length(Data0509[,1])
length(Data0610[,1])

#store median and average sample sizes for each 5-year period
#store median and average feature sizes for each 5-year period

Y0307<-c(median(Data0307[,2]),median(Data0307[,3]),mean(Data0307[,2]),mean(Data0307[,3]),median(Data0307[,2]/Data0307[,3]),mean(Data0307[,2]/Data0307[,3]))
Y0408<-c(median(Data0408[,2]),median(Data0408[,3]),mean(Data0408[,2]),mean(Data0408[,3]),median(Data0408[,2]/Data0408[,3]),mean(Data0408[,2]/Data0408[,3]))
Y0509<-c(median(Data0509[,2]),median(Data0509[,3]),mean(Data0509[,2]),mean(Data0509[,3]),median(Data0509[,2]/Data0509[,3]),mean(Data0509[,2]/Data0509[,3]))
Y0610<-c(median(Data0610[,2]),median(Data0610[,3]),mean(Data0610[,2]),mean(Data0610[,3]),median(Data0610[,2]/Data0610[,3]),mean(Data0610[,2]/Data0610[,3]))

#create matrix to store median and mean values

YearSet<-c("2003-2007","2004-2008","2005-2009","2006-2010")
SFCount<-c("SampleMed","FeatureMed","SampleMean","FeatureMean","S-F.Med","S-F.Mean")
Count.GEO<-matrix(c(Y0307,Y0408,Y0509,Y0610),nrow=4,ncol=6,byrow=TRUE,dimnames=list(YearSet,SFCount))
Count.GEO

#store standard deviation and variance values for each five year period in a matrix

SSD.GEO<-matrix(c(sd(Data0307[,2]),sd(Data0408[,2]),sd(Data0509[,2]),sd(Data0610[,2])))
SVAR.GEO<-SSD.GEO*SSD.GEO
dimnames(SSD.GEO)=list(row.names(Count.GEO),"SampleStdDev")
dimnames(SVAR.GEO)=list(row.names(Count.GEO),"SampleVariance")
SSD.GEO;SVAR.GEO

FSD.GEO<-matrix(c(sd(Data0307[,3]),sd(Data0408[,3]),sd(Data0509[,3]),sd(Data0610[,3])))
FVAR.GEO<-FSD.GEO*FSD.GEO
dimnames(FSD.GEO)=list(row.names(Count.GEO),"FeatureStdDev")
dimnames(FVAR.GEO)=list(row.names(Count.GEO),"FeatureVariance")
FSD.GEO;FVAR.GEO

SFSD.GEO<-matrix(c(sd(Data0307[,2]/Data0307[,3]),sd(Data0408[,2]/Data0408[,3]),sd(Data0509[,2]/Data0509[,3]),sd(Data0610[,2]/Data0610[,3])))
SFVAR.GEO<-SFSD.GEO*SFSD.GEO
dimnames(SFSD.GEO)=list(row.names(Count.GEO),"S-F.StdDev")
dimnames(SFVAR.GEO)=list(row.names(Count.GEO),"S-F.Variance")
SFSD.GEO;SFVAR.GEO

#graph sample size and feature size over time

library(gplots)

par(mfrow=c(2,1))

###(no error bars->)plot(x=Count.GEO[,1],ylim=c(0,60),xlab="",ylab="",type="o",col="red",axes=F,frame=T)
###(no error bars->)lines(Count.GEO[,3],type="o",col="blue")
plotCI(x=Count.GEO[,1],uiw=SSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,60),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.GEO[,3],uiw=SSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,60),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:4,row.names(Count.GEO))
title(xlab="5-Year Period",ylab="Samples","GEO: Mean and Median Sample Size over 5-Year Periods")
legend(1,60,title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

###(no error bars->)plot(Count.GEO[,2],ylim=c(0,60000),type="o",col="red",axes=F,frame=T,xlab="",ylab="")
###(no error bars->)lines(Count.GEO[,4],type="o",col="blue")
plotCI(x=Count.GEO[,2],uiw=FSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,60000),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.GEO[,4],uiw=FSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,60000),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:4,row.names(Count.GEO))
title(xlab="5-Year Period",ylab="Features","GEO: Mean and Median Feature Size over 5-Year Periods")
legend(1,60000,title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#graph comparing samples and features over time, with error bars

par(mfrow=c(2,1))

#Option 1: x = 5-Year Period, y = S-F Ratio

###(no error bars->)plot(Count.GEO[,5],ylim=c(0,0.002),type="o",col="red",axes=F,frame=T,xlab="",ylab="")
###(no error bars->)lines(Count.GEO[,6],type="o",col="blue")
plotCI(x=Count.GEO[,5],uiw=SFSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.01),type="o",col="red",xlab="",ylab="")
plotCI(x=Count.GEO[,6],uiw=SFSD.GEO[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.01),type="o",col="blue",xlab="",ylab="",add=TRUE)
axis(2);axis(1,1:4,row.names(Count.GEO))
title(xlab="5-Year Period",ylab="S-F Ratio","GEO: Mean and Median Sample-Feature Ratio over 5-Year Periods")
legend(1,0.01,title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#Option 2: x = Samples, y = Features

plot(Count.GEO[,1]/max(gds.count.year[,2]),Count.GEO[,2]/max(gds.count.year[,3]),xlim=c(0.04,0.06),ylim=c(0.30,0.32),xlab="",ylab="",type="o",col="red")
lines(Count.GEO[,3]/max(gds.count.year[,2]),Count.GEO[,4]/max(gds.count.year[,3]),type="o",col="blue")
title(xlab="Samples (normalized)",ylab="Features (normalized)","GEO: Feature Size vs. Sample Size over 5-Year Periods")
legend("bottomright",title="Legend",c("Median","Mean","5-Yr Period (progressing from bottom up)"),lty=c(1,1,0),lwd=c(1,1,0),pch=c(1,1,1),col=c("red","blue","black"))

#To allow for statistical analysis, create matrices of equal column lengths with sample data and feature data from each 5-year period

Svec0307<-Data0307[,2]
Svec0408<-Data0408[,2]
Svec0509<-Data0509[,2]
Svec0610<-Data0610[,2]

Fvec0307<-Data0307[,3]
Fvec0408<-Data0408[,3]
Fvec0509<-Data0509[,3]
Fvec0610<-Data0610[,3]

length(Svec0307)<-2138;length(Svec0408)<-2138;length(Svec0509)<-2138;length(Svec0610)<-2138
length(Fvec0307)<-2138;length(Fvec0408)<-2138;length(Fvec0509)<-2138;length(Fvec0610)<-2138

SData.GEO<-cbind(Svec0307,Svec0408,Svec0509,Svec0610)
dimnames(SampleData.GEO)=list(NULL,NULL)
FData.GEO<-cbind(Fvec0307,Fvec0408,Fvec0509,Fvec0610)
dimnames(FeatureData.GEO)=list(NULL,NULL)

#Perform student's t-test on sample data and feature data from different 5-year periods...???
#Perform analysis of variance on sample data and feature data from different 5 year periods...???

###t.test(x,y)
###aov(x~y*z)
###summary()

