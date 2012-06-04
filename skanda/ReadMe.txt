Brief documentation on the code and data on GitHub that I worked on, organized by directory. If there are any problems encountered or if some portion of text is ambiguous, please feel free to ask for support of clarification (skoppula@andover.edu).

ON THE PROGRAMS (under GroupData/Skanda/code):

--The Pipeline (C:\home\skanda\PRIMES\GroupData\Skanda\code\pipeline_src_compilation_related\pipeline-with-src-april-2012\pipeline-src.jar)

 The pipeline is intended to determine sets of features that
> produces a statistically significant classifier. The pipeline was
> written in Java, and you can find the latest source code here:
> GroupData\Skanda\code\pipeline_src_compilation_related\pipeline-with-src-april-2012\src.
>
> We run the pipeline by excecuting a small script that reads the
> parameters, the locaton/name of the Pipeline Java, and sets up the
> classpath. One of the recent versions of the script we used can  be
> found here: C:\home\skanda\PRIMES\GroupData\Skanda\code\pipeline_src_compilation_related\pipeline-with-src-april-2012\run-pipeline-coga
>
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/ssj.jar
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/applib.jar
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/colt.jar
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/junit.jar
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/org.hamcrest.core_1.1.0.v20090501071000.jar
> CLASSPATH=$CLASSPATH:/scratch/koppula/pipeline-kent/pipeline_lib/weka.jar
> export CLASSPATH
>
> /usr/lib/jvm/java-6-sun-1.6.0.26/jre/bin/java -d64
> -XX:+UseConcMarkSweepGC -Xmx70g -jar pipeline-src.jar
> coga.properties.txt
>
> To use it in your specific project, please note you will have to
> modify the script's contents to set up the appropriate memory usage
> specifications, classpath inclusions, directory/name of properties,
> etc! Since ,I run the script using nohup: in Terminal I run: nohup
> ./run-pipeline-coga &.
>
> The properties file that the script refers to another file that
> determines the specifications of the analysis. An example properties
> file would be:
>
> suppressErrors = y
> isSNPData = y
> calculateFisher = n
> envVariables = y
> numEnvVariables = 2
> multithreading = y
> iterations = 500
> snpToGenes = /scratch/koppula/data/cogend-snp-annotations.csv
> distanceIndex = 9
> geneIndex = 8
> delim = ,
> extendedAnnotation = y
> conceptToGenesList = datasets/c2.cp.kegg.v3.0.symbols.gmt KEGG\n\
> datasets/c5.bp.v3.0.symbols.gmt    GO
> lowerThreshold = 5
> upperThreshold = 1000
> trainFull = /scratch/koppula/data/cogend-sync.arff
> classifier = NaiveBayes
> alpha = 0.01,0.05,0.1,0.25,0.4,0.5
> corrections = all
> outputDir = output/
> savePValuesFileName = output/
>
> I suggest looking through the source code (especially the comments in
> the Main2 class) to find a more complete idea of the parameters that
> you can modify. Take special note of the two data input parameters: 1.
> the convention used for analyzing multiple sets of pathways lists (ex.
> KEGG) and 2. the training clinical data must suite the ARFF or CSV
> data formats. Additionally, if your analysis requires SNP,
>
> The output of the pipeline analysis is a set of text files in the
> specified output directory with the computed AUROC and significance of
> each pathway tested.
>
> --The miscellaneous code developed over the course of my project
> insofar (Java programs found under
> GroupData\Skanda\code\BioCyb_MIT\Phase1)
>
> First, note that all programs must be compiled and executed by the
> user, because the input directories/names are hardcoded into the
> source. These were originally intended for my use (hence . Time
> permitting, I'll generalize the use of the programs. In summary: to
> use these programs in your project now, you'll need to change the
> value of String variables named something along the lines of
> "inputfile" to suite your project's specifications.
>
> A little listing and description about these programs:
> ----CommonPathwayFinder.java: this is used to determine the pathways
> (a set of feature lists) in common, between to an arbitrary number of
> set of textfiles. These textfiles are generally pipeline output files,
> each of which is a listing of the significant pathways, each pathway's
> p-value and its AUROC. This is used to identify reproducible/robust
> pathways. The program outputs those pathways in common between the
> pipeline's results of significant pathways (the results after
> analyzing two or more data sets)
>
> ----DataPartition.java: the program was initially used to split and
> distribute the SNPs a large list of SNPs to an input, n, number of
> textfiles. This enables a method of "manual parellization" - each
> smaller list can be processed on a different machine to create a SNP
> to gene mapping. This would result in n gene-snp mapping files, which
> we combine using the small executable found
> GroupData\Skanda\code\annotated-results-programs\merge-data.bat.
> Please note when using this tool to remerge, if you have a descriptor
> header row for each mapping file, it will be included multiple times
> in the merged file. Delete the descriptor header row on each mapping.
> DataPartition is one of the handful of programs which I generalized:
> you can run the jar file found at
> C:\home\skanda\PRIMES\GroupData\Skanda\code\annotated-results-programs\DataPartition.jar
> with parameters of the SNP list directory and num files.
>
> ---DataPartitionCogaSync.java is the first, fast-write program written
> for my specific project before I generalized it in the aforementioned
> program. This program is deprecated, and use of DataPartition.java is
> preferred and more convenient to the user.
>
> ---FileWritingPerfomanceTest.java: used mostly to optimize other IO
> intensive programs in the project and for my own knowledge, I quickly
> drafted this program to compare the time-performance of the two common
> file writing methods in Java.
>
> ---Format_SNP_List.java: converts the list of features preceding data
> in an .CSV file to a list of features in a seperate text file in the
> .wr format. This text file is commonly used later in analysis in
> WGAViewer.
>
> ---OntologySizeCount.java: determines the distribution of pathway size
> (measured by number of genes/SNPs), given a dataset listing of
> pathways (e.g. GroupData\Skanda\data\c2.cp.kegg.v3.0.symbols.gmt).
> Outputs results to console.
>
>
> ---ReducingDataset.java: Takes in training/testing data and given a
> number of features and number of patients, it reduces the data to
> contain those number of features for those number of patients.
> Input/Output file directory specified in the program source.
>
> ---SelectFromCompleteDataSet.java: Reads the first labels of the "n"
> features from the training data text file, then outputs just those
> labels into a seperate text file.