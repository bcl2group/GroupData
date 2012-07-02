You can check the usage of pipeline(in the attachments) with following command:
java -jar pipeline.jar --help

I've also prepared two test files, and attached them in this email.
One example to test the pipeline on these files is:
java -jar pipeline.jar --srcR testForRaw.raw --des outForRaw.arff
--list testForRaw.list --name MajorDepression --test

It should finish processing 500 SNPs within 2 seconds (actually, most
of the time consumption is to print info). The log info is also
attached.

The test file in this example is raw file. If you only have arff file,
you just need to use --srcA instead of --srcR.

I've also contacted with Amin today via emails using my cell phone. He
said he will let you know once the pipeline works fine. Now, he only
have tested the pipeline on very limited data, and verified the
correctness on large data is difficult. Therefore, so far, he cannot
still say it works correctly and he has many other suggestions on
extending the pipeline.

If you're still trying to use this pipeline on dbGap data. I can also
provide some info on that. Based on my recently experiences on dbGap
data, the raw files, linkageplots/scatterplots files are all unrelated
to our work. The former one only contains .PNG files about the data
distribution, etc, while the latter one only contains large amount of
.CEL files which are the original data files collected by some special
operating system. Also, the files won't be related to our work if the
file name contains "qc", which means quality control. Those files seem
to be generated when they collect the raw data.