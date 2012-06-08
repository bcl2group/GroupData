import os
import glob
import igraph

all_paths = set([])

path = 'C:\Users\Tiffany\Documents\Thesis\Multinet'
written = 'C:\Users\Tiffany\Documents\Thesis\Multinet\list.txt'



for infile in glob.glob(os.path.join(path, '*.txt')):
    if not infile[-5] == "s" and not infile[-4:] == "arff":
        print infile
        all_paths.add(infile)

wr = open(written, 'w')

for active_path in all_paths:
    print "This is the network at: " + str(active_path)
    outpath = active_path[:-4] + str('_edgelist.csv')
    wr.write(outpath + "\n")
    
    print "The output is at: " + str(outpath)
    x = open (active_path, 'r')
    net_started = "false"
    net_ended = "false"
    edge_list = {}
    for line in x:
        line = line.strip()
        if line.startswith("Network str"):
            net_started= "true"
        if line.startswith("LogScore"):
            net_ended = "true"
        if net_started== "true" and net_ended == "false" and not line.startswith("Network str"):
            first_half = line.strip().split(":")[0].split("(")[0]
            second_half =line.strip().split(":")[1].split(" ")[1:]
            edge_list[first_half] = second_half

    node_to_number = {}
    number_to_node = {}
    count = 0

    ou  = open (outpath, 'w')
    #ou.write("PARENT,CHILD\n")
    for node in edge_list:
        for parent in edge_list[node]:
            ou.write(str(parent) + "," + str(node) + "\n")

    ou.close()
    x.close()
    
