def construct_nodes():
  lower_node_dict = {}
  upper_node_dict = {}
  mesh_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/meshonto.owl", 'r')
  
  lines = mesh_file.readlines()
  lower_node_string = '  &lt;rdf:Description rdf:about="http://org.snu.bike/MeSH#'
  lower_node_str_length = len(lower_node_string)
  upper_node_stop_string = '  &lt;/rdf:Description&gt;'
  upper_node_check_string = '    &lt;rdfs:subClassOf '
  check_str_length = len(upper_node_check_string)

  for l in range(len(lines)):
#  for l in range(40):
    line = lines[l]
    if line[:lower_node_str_length] == lower_node_string:
#      print "current line ---> " + str(line)
      ## valid lower node
      lower_node_start = line.rindex("#") + 1 
      lower_node_stop = line.rindex('"')
      lower_node = line[lower_node_start:lower_node_stop]
      if lower_node not in lower_node_dict:
        lower_node_dict[lower_node] = []
      counter = 1
      next_line = lines[l+1]
      
      while(next_line[:-1] != upper_node_stop_string): 
#        print "Counter ---> " + str(counter)
#	print "current next line ---> " + str(next_line)
	upper_node_check_index = next_line.index(" ")

	if next_line[:check_str_length] == upper_node_check_string:
          upper_node_start = next_line.rindex("#") + 1
	  upper_node_stop = next_line.rindex('"')
	  upper_node = next_line[upper_node_start:upper_node_stop]

	  lower_node_dict[lower_node].append(upper_node)
#	  print "lower node ---> " + str(lower_node)

	  if upper_node not in upper_node_dict:
	    upper_node_dict[upper_node] = []
	  upper_node_dict[upper_node].append(lower_node) 
#	  print "upper node ---> "+ str(upper_node)

	counter += 1
	next_line = lines[l+counter]
    print ""
  return lower_node_dict, upper_node_dict


def mesh_to_disease_dict(useful_ids):
  mesh_disease_dict = {}
  #mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/MM_diseasesToGDSIDs.txt','r')

  for line in mappings:
    line_array = line.split('\t')
    disease_name = line_array[0]
    mesh_name = disease_name.split(', ')
    disease_name = disease_name.replace(",", "")
    disease_name = disease_name.replace(" ", "_")

    if disease_name in useful_ids:
      mesh_name.reverse()
      mesh_name = "_".join(mesh_name)
      mesh_name = mesh_name.replace(" ", "_")
      mesh_name = mesh_name.lower()
      ## take out all commas, replace spaces with _
      mesh_disease_dict[mesh_name] = disease_name 
    
  return mesh_disease_dict 


def nodes_to_file(lower_node_dict, upper_node_dict, mesh_disease_dict):
  useful_ids = mesh_disease_dict.keys()

  for lower_node in lower_node_dict:
    lower_node_clean = lower_node.replace("__", "_")
    #if lower_node_clean in useful_ids: 
    if lower_node_clean in useful_ids: 
      print "lower node useful ---> " + str(lower_node)
      ## write to file
      #lower_node_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/lower_nodes/"+lower_node+".txt",'a')
      lower_node_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology_MM/lower_nodes/"+lower_node+".txt",'a')
      for upper_node in lower_node_dict[lower_node]:
	upper_node_clean = upper_node.replace("__", "_")
        if upper_node_clean in useful_ids:
	  print ""
	  print "upper node useful ---> " + str(upper_node)
	  print ""
	  lower_node_file.write(upper_node + "\n") 
      lower_node_file.close()
  print "---------------------------"	  
  for upper_node in upper_node_dict:
    if upper_node in useful_ids: 
      ## write to file
      print "upper node useful ---> " + str(lower_node)
      #upper_node_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology/upper_nodes/"+upper_node+".txt",'a')
      upper_node_file = open("/scratch/vinnie/GEOPipelineFiles_ubuntu/mesh_ontology_MM/upper_nodes/"+upper_node+".txt",'a')
      for lower_node in upper_node_dict[upper_node]:
	lower_node_clean = lower_node.replace("__", "_")
        if lower_node_clean in useful_ids:
	  print "lower node useful ---> " + str(upper_node)
	  print ""
	  upper_node_file.write(lower_node + "\n") 
      upper_node_file.close()






#useful_disease_file = open("/scratch/vinnie/multinet/multinet/useful_diseases.txt", 'r')
useful_disease_file = open("/scratch/vinnie/multinet/multinet/useful_diseases_MM.txt", 'r')
useful_diseases = []
for line in useful_disease_file:
  useful_diseases.append(line[:-1])
useful_disease_file.close()

mesh_disease_dict = mesh_to_disease_dict(useful_diseases)
mesh_diseases = mesh_disease_dict.keys()
mesh_diseases.sort()
useful_diseases.sort()

lower_node_dict, upper_node_dict = construct_nodes()

length_node_dict = {} 

#for node in upper_node_dict:
for node in lower_node_dict:
  node_clean = node.replace("__", "_") 
  if node_clean in mesh_diseases:
#    print "useful node ---> " + str(node_clean)
    #length = len(upper_node_dict[node])
    length = len(lower_node_dict[node])
    if length not in length_node_dict:
      length_node_dict[length] = []
    length_node_dict[length].append(node)

lengths = length_node_dict.keys()
lengths.sort()
lengths.reverse()

#print "10 longest ---> " + str(lengths[:10])

#for length in lengths[:10]:
#  print "length ---> " + str(length)
#  print "nodes ---> " + str(length_node_dict[length])
#  print ""

#disease_neo = mesh_disease_dict['neoplasm']
#print "mesh_disease_dict[neoplasm] ---> " + str(disease_neo)
#print "neoplasms subclasses ---> " + str(upper_node_dict['neoplasm'])
 
#print "len(mesh disease dict) ---> " + str(len(mesh_diseases))
#print "useful diseases ---> " + str(useful_diseases[:10])
#print "mesh disease dict [:10] ---> " + str(mesh_diseases[:40])

nodes_to_file(lower_node_dict, upper_node_dict, mesh_disease_dict)

