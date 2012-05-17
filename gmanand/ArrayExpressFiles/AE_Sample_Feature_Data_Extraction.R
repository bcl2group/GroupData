#Date:4/25/2012
source("http://bioconductor.org/biocLite.R")
biocLite("ArrayExpress")
library(ArrayExpress)

eset<-ArrayExpress('E-ID-#') #this is one of tens of thousand datasets in AE. If you know the IDs you can download them like this.
data<-c(length(eset),length(featureNames(eset)))

ads.count.year<-read.table("c:/AEtabdata.txt", sep="\t") 
names(ads.count.year)<-c("id","sample_count","update_date")
ads.count.year[,1]<-as.character(ads.count.year$id)

##################################################################################
#Extract feature size
for(i in 1:5894){
feature_count=c(feature_count,length(featureNames(ArrayExpress(ads.count.year[i,1]))))
}
ads.count.year[,4]=feature_count
names(ads.count.year[,4])<-c("feature_count")
##################################################################################

ads.count.year[,4]=rep(0,5894)

#find maximum and minimum sample and feature values
max(ads.count.year[,2])
min(ads.count.year[,2])
max(ads.count.year[,4])
min(ads.count.year[,4])

#Median and mean sizes
Yearvec<-ads.count.year$update_date
Data1<-ads.count.year[which(Yearvec>=2002 & Yearvec<=2006),]
Data2<-ads.count.year[which(Yearvec>=2007 & Yearvec<=2011),]
dim(Data1)
dim(Data2)
Values1<-c(median(Data1[,2]),median(Data1[,4]),mean(Data1[,2]),mean(Data1[,4]),median(Data1[,2]/Data1[,4]),mean(Data1[,2]/Data1[,4]))
Values2<-c(median(Data2[,2]),median(Data2[,4]),mean(Data2[,2]),mean(Data2[,4]),median(Data2[,2]/Data2[,4]),mean(Data2[,2]/Data2[,4]))
YearSet<-c("2002-2006","2007-2011")
SFCount<-c("SampleMed","FeatureMed","SampleMean","FeatureMean","S-F.Med","S-F.Mean")
Count.AE<-matrix(c(Values1,Values2),nrow=2,ncol=6,byrow=TRUE,dimnames=list(YearSet,SFCount))
Count.AE

#Standard deviation
SSD.AE<-matrix(c(sd(Data1[,2]),sd(Data2[,2])))
dimnames(SSD.AE)=list(row.names(Count.AE),"SampleStdDev")
SSD.AE

FSD.AE<-matrix(c(sd(Data1[,4]),sd(Data2[,4])))
dimnames(FSD.AE)=list(row.names(Count.AE),"FeatureStdDev")
FSD.AE

SFSD.AE<-matrix(c(sd(Data1[,2]/Data1[,4]),sd(Data2[,2]/Data2[,4])))
dimnames(SFSD.AE)=list(row.names(Count.AE),"S-F.StdDev")
SFSD.AE


#Independent graphs

library(gplots)

par(mfrow=c(2,1))

plotCI(x=Count.AE[,1],uiw=SSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,200),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.AE[,3],uiw=SSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,200),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="5-Year Period",ylab="Samples","AE: Mean and Median Sample Size over 5-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

plotCI(x=Count.AE[,2],uiw=FSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50000),xlab="",ylab="",type="o",col="red")
plotCI(x=Count.AE[,4],uiw=FSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,50000),xlab="",ylab="",type="o",col="blue",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="5-Year Period",ylab="Features","AE: Mean and Median Feature Size over 5-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#Dependent graphs

library(gplots)

par(mfrow=c(2,1))

#Option 1: x = 5-Year Period, y = S-F Ratio

plotCI(x=Count.AE[,5],uiw=SFSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.05),type="o",col="red",xlab="",ylab="")
plotCI(x=Count.AE[,6],uiw=SFSD.AE[,1],lty=3,xaxt="n",gap=0.5,ylim=c(0,0.05),type="o",col="blue",xlab="",ylab="",add=TRUE)
axis(2);axis(1,1:2,YearSet)
title(xlab="4-Year Period",ylab="S-F Ratio","AE: Mean and Median Sample-Feature Ratio over 5-Year Periods")
legend("topleft",title="Legend",c("Median","Mean"),lty=c(1,1),lwd=c(1,1),pch=c(1,1),col=c("red","blue"))

#Option 2: x = Samples, y = Features

plot(Count.AE[,1]/sd(ads.count.year[,2]),Count.AE[,2]/sd(ads.count.year[,3]),xlim=c(0,1),ylim=c(0,2),xlab="",ylab="",type="o",col="red")
lines(Count.AE[,3]/sd(ads.count.year[,2]),Count.AE[,4]/sd(ads.count.year[,3]),type="o",col="blue")
title(xlab="Samples (normalized)",ylab="Features (normalized)","AE: Feature Size vs. Sample Size over 5-Year Periods")
legend("bottomright",title="Legend",c("Median","Mean","5-Yr Period (progressing from bottom up)"),lty=c(1,1,0),lwd=c(1,1,0),pch=c(1,1,1),col=c("red","blue","black"))

#Statistical analysis
Svec1<-Data1[,2]
Svec2<-Data2[,2]
Fvec1<-Data1[,4]
Fvec2<-Data2[,4]
length(Svec1)=length(Svec2);length(Fvec1)=length(Fvec2)
SData.AE<-cbind(Svec1,Svec2)
dimnames(SData.AE)=list(NULL,NULL)
FData.AE<-cbind(Fvec1,Fvec2)
dimnames(FData.AE)=list(NULL,NULL)

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