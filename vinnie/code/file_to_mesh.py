from sets import Set

def file_to_mesh():
  disease_id_dict = {}
  #mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/MM_diseasesToGDSIDs.txt','r')
  counter = 0
  clean_name_list = []
  for line in mappings:
    line_array = line.split('\t')
    disease_name = line_array[0]
    disease_name = disease_name.lower()
    comma_count = disease_name.count(',')
    comma_index_list = []
    disease_name_split = disease_name.split(", ") 
    disease_name_split.reverse()
    clean_name = "_".join(disease_name_split)
    clean_name = clean_name.replace(" ", "_")
    clean_name_list.append(clean_name)
  mappings.close()
  return clean_name_list

  #return clean_name_list[:20] 

def term_to_mesh(term):
  disease_name = term
  disease_name = disease_name.lower()
  comma_count = disease_name.count(',')
  comma_index_list = []
  disease_name_split = disease_name.split(", ") 
  disease_name_split.reverse()
  clean_name = "_".join(disease_name_split)
  clean_name = clean_name.replace(" ", "_")
  return clean_name

#print "clean names ---> " + str(file_to_mesh())

def mesh_to_disease():
  mesh_disease_dict = {}
  #mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/MM_diseasesToGDSIDs.txt','r')
  counter = 0
  clean_name_list = []
  for line in mappings:
    if counter > 5:
      return disease_id_dict 
    line_array = line.split('\t')
    disease_name = line_array[0]
    # ---- mesh stuff ---- #
    mesh_name = disease_name.lower()
    comma_count = mesh_name.count(',')
    comma_index_list = []
    mesh_name_split = mesh_name.split(", ") 
    mesh_name_split.reverse()
    clean_name = "_".join(mesh_name_split)
    clean_name = clean_name.replace(" ", "_")
    clean_name_list.append(clean_name)

    ## take out all commas, replace spaces with _
    disease_name = disease_name.replace(",", "")
    disease_name = disease_name.replace(" ", "_")
    mesh_disease_dict[clean_name] = disease_name
  return mesh_disease_dict

def get_disease_id_dict():
  disease_id_dict = {}
  #mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/MM_diseasesToGDSIDs.txt','r')
  counter = 0
  for line in mappings:
    if counter > 5:
      return disease_id_dict 
    line_array = line.split('\t')
    disease_name = line_array[0]
    ## take out all commas, replace spaces with _
    disease_name = disease_name.replace(",", "")
    disease_name = disease_name.replace(" ", "_")
#    print "disease name ---> " + str(disease_name)
#    print "line array ---> " + str(line_array)
#    print "len of line array ---> " + str(len(line_array))
    if len(line_array) > 1 and line_array[-1] != "\n":
#      print "line array filtered ----> " + str(line_array)
      ids = line_array[1]
    # dont include the new line command
      disease_id_dict[disease_name] = ids[:-1]
  mappings.close()
  return disease_id_dict

def get_disease_useful_id_dict(disease_list):
  disease_useful_dict = {}
  #directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs/'
  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs_MM/'
  for disease in disease_list:
    id_set = Set([])
    file_name = disease + "_usefulIDs.txt"
    try:
      file = open(directory + file_name, 'r')
    except IOError as e:
      file = None 
    useful_ids = "" 
    if file:
      for line in file:
        id = line[:-1]
        if id not in id_set:
          if useful_ids == "":
            useful_ids += id 
          else:
            useful_ids += "," + id
	  id_set.add(id)
        disease_useful_dict[disease] = useful_ids
  return disease_useful_dict


def write_useful_ids_to_file():
  diseases = get_disease_id_dict()
  disease_names = diseases.keys()

  useful_id_dict = get_disease_useful_id_dict(disease_names)
  useful_disease_names = useful_id_dict.keys()
  useful_disease_names.sort()
  #useful_file = open("/scratch/vinnie/multinet/multinet/useful_disease_list.txt", 'a')
  useful_file = open("/scratch/vinnie/multinet/multinet/useful_disease_list_mm.txt", 'a')
  for disease in useful_disease_names:
    useful_file.write(str(disease) + "\n")
  useful_file.close()

#write_useful_ids_to_file()
