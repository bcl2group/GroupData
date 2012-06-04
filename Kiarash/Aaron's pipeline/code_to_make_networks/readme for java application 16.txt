The 16 app takes the data .arff file and creates new .arff files (7 per run) and the results text file.

The grapher.py writes a list of filenames that is later read by the intogephi java script.

The intogephi java script takes the list of filenames and produces edgelists and either .pngs or .svgs depending upon what file extension you write to.

---------------


To start the script - execute the following command

java -Xmx30g -jar [[location of JavaApplication16.jar file]] "make-graphs" [[folder and name stub for output - ending "../graph_"]] [[location of all_data.csv.arff]]

for example on my computer it would be java -Xmx30g -jar "C:/Users/Aaron/Documents/My Dropbox/Gil_Aaron/Academic/Reza/JavaApplication16/dist/JavaApplication16.jar" "make-graphs" "C:/Users/Aaron/Documents/My Dropbox/Gil_Aaron/Academic/Reza/graph_" "C:/Users/Aaron/Documents/My Dropbox/Gil_Aaron/Academic/Reza/all_data.csv.arff"

To open the files - put weka.jar on your CLASSPATH (by using set CLASSPATH = [[location to weka.jar]] or other method) and then call - java weka.classifiers.bayes.net.GUI [[location to file to open]]

alternative, after setting weka on the CLASSPATH, you can just call java weka.classifiers.bayes.net.GUI with nothing after it, and use the GUI to open a file.

After you have a file open (nodes are all on top of each other) just hit Control - L  (or go to tools layout) and hit layout graph.

And you have a graph!
