from sets import Set
import file_to_mesh as converter 
## compound nodes and atomic nodes
## atmoic nodes --> dont have sublcasses
## compound nodes --> have subclasses
def create_node_files():
  mesh_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/meshonto.owl")

  lines = mesh_file.readlines()
  lower_node_set = Set([])
  upper_node_set = Set([])

  upper_node_dict = {}
  lower_node_dict = {}

  
  for l in range(len(lines)):
#  for l in range(40):
    line = lines[l]
    if line[:58] == '  &lt;rdf:Description rdf:about="http://org.snu.bike/MeSH#':
    #term_start = 58 
      term_start = line.index("#")+1 
      term_stop = line.rindex('"')
      lower_node = line[term_start:term_stop]
#      print "lower node ---> " + str(lower_node)
      if lower_node not in lower_node_dict:
        lower_node_dict[lower_node] = []
      
#      lower_file_name = 'lower_nodes/' + str(lower_node) + "_upclasses.txt"
#      lower_file = open(directory+lower_file_name, 'w') 

      counter = 1
      next_line = lines[l+1] 

      stop = "  &lt;/rdf:Description&gt;\n"
      while(next_line != stop):
#	print "next line ---> " + str(next_line)
	upper_term_start = next_line.index("#")+1
	upper_term_stop = next_line.rindex('"')
#	print "next line till term start----"
#	print next_line[:next_line.index("#")]
        if next_line[:upper_term_start] == '    &lt;rdfs:subClassOf rdf:resource="http://org.snu.bike/MeSH#':
          upper_node = next_line[upper_term_start:upper_term_stop]
	  lower_node_dict[lower_node].append(upper_node)
	  if upper_node not in upper_node_dict:
	    upper_node_dict[upper_node] = []
	  upper_node_dict[upper_node].append(lower_node)

#	  print "upper node ---> " + str(upper_node)

#	  lower_file.write(upper_node + "\n")
#
#	  upper_file_name = 'upper_nodes/' + str(upper_node) + "_subclasses.txt"
#	  upper_file = open(directory+upper_file_name, 'w')
#	  upper_file.write(lower_node + "\n")
#	  upper_file.close()
	counter += 1
	next_line = lines[l+counter]
  mesh_file.close()
  return (upper_node_dict, lower_node_dict)
#  print "upper node dict ---> " + str(upper_node_dict)
#  print "lower node dict ---> " + str(lower_node_dict)

#      lower_file.close()
#      print ""
	  
	  
     
  ## subclass and upclass files
    ## subclass holds sub classes of some node i
    ## upclass holds upclasses (things node i is a subclass of) of node i
    ## upclasses are essentially edges going to more general terms
  ## node set --> holds nodes i've already seen
  ## go through each line of ontology.owl
  ## if sublcass of: line isnt in node set, eg: a is subclass of b
    ## create a subclass file for that higher node (b)
    ## put this a in that file 
    ## create a upclass file for node a
    ## put node b in that file

upper_dict, lower_dict = create_node_files()

#print "upper dict ---> " + str(upper_dict)
#print "lowr_dict ---> " + str(lower_dict)

useful_disease_file = open("/scratch/vinnie/multinet/multinet/useful_disease_list.txt",'r')
useful_disease_list = useful_disease_file.readlines()

for d in range(len(useful_disease_list)):
  disease = useful_disease_list[d]
  clean_disease = disease.replace("\n", "")
  useful_disease_list[d] = clean_disease

convert_dict = converter.mesh_to_disease()
valid_diseases = convert_dict.keys()

for upper_node in upper_dict:
  upper_node_clean = upper_node.replace("__", "_")
  if upper_node_clean in valid_diseases:
    disease_upper = convert_dict[upper_node_clean] 
    #if disease_upper in useful_disease_list: 
    print "--- good upper node---"
    print str(upper_node_clean)
    for lower_node in upper_dict[upper_node]:
      lower_node_clean = lower_node.replace("__", "_")
      if lower_node_clean in valid_diseases:
        print "### good lower node ###"
        print str(lower_node_clean)
        directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/"
        upper_file_name = 'upper_nodes/' + str(upper_node_clean) + "_subclasses.txt"
        upper_file = open(directory+upper_file_name, 'a')
        upper_file.write(lower_node_clean + "\n")
        upper_file.close()
    print ""

for lower_node in lower_dict:
  lower_node_clean = lower_node.replace("__", "_")
  if lower_node_clean in valid_diseases:
    disease_lower = convert_dict[lower_node_clean] 
    for upper_node in lower_dict[lower_node]:
      upper_node_clean = upper_node.replace("__", "_")
      if upper_node_clean in valid_diseases:
        directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/"
        lower_file_name = 'lower_nodes/' + str(lower_node_clean) + "_upclasses.txt"
        lower_file = open(directory+lower_file_name, 'a')
        lower_file.write(upper_node_clean + "\n")
        lower_file.close()
