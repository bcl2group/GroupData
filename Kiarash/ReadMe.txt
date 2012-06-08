
notes: 

- We want to begin with two inputs: GEO data and dbGaP. Tiffany and Neena has used GEO but Aaron has used dbGaP. There is also GSE to use...

- datasets should be matched to diseases...     

- we call Weka to make the Bayesian networks.

-In Tiffany's reseach Weka is used for cross-validation (She didn't make the actual Bayesian networks). To do similar thing we need the Weka software. but If we want to build the bayesian networks, in order to further compare the bayesian networks, we might want to use similar code to HIVMultinetBuilder.java or Multinet.zip; in this case we still need two jar files - to be downloaded from Weka website.

-To understand what Tiffany has done, reading her thesis seems to be useful. 

-Neena's pipeline is explained in GEO_TBIpaper8_V2.pdf.

-Aaron's pipeline makes an automatic report at the end of the pipeline, which is good to have in our version of the pipeline. Aaron's pipeline is not on Git... it is on Dropbox...

-we want to make the final output in the form of a document. We can use yEd API in that part. Yed is free- the viewer.
Yfiles HTML 3 API is free as eval version.
 

- it is probably a good idea to explore "knime". one can make a workflow there and we can add Java code in the desing too. there are Weka and R and yEd plug-ins. more information about knime is in "knime info.txt"

--------

things to do when checking the commonalities between diseases: 

1- choose a disease.
2- find the similarities between other diseases and this one.


1- list of genes that are most predictive of each disease.
2- looking at the network, if node a and node b are connected with an edge and a and b are not connceted in another network... this is a meaure of networks connectivity.
3- propogation, if with put node a high, would other nodes get affected. and check if this happens in other networks.