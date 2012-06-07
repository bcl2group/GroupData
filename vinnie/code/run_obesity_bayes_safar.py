from sets import Set
import subprocess
import random
import sys

  

def get_disease_id_dict():
  disease_id_dict = {}
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
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
  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs/'
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



def get_ids(disease="obesity"):
  mappings = open('/scratch/vinnie/GEOPipelineFiles_ubuntu/HS_diseasesToGDSIDs.txt','r')
  for line in mappings:
    line_array = line.split('\t')
    disease_name = line_array[0]
    disease_name = disease_name.replace(",", "")
    disease_name = disease_name.replace(" ", "_")
    if disease_name.upper() == disease.upper():
#      print "disease name ---> " + str(disease_name)
      ids = line_array[1]
      # dont include the new line command
      return ids[:-1]

def get_random_samples(experiment, threshold):
  print "in get random smaples"
  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/tmp/'
  exp_name = 'GDS' + experiment
  file_name = directory + exp_name


  ## assuming hte file is already cached ##
  ## temporarily create a soft file to read in ##
  subprocess.call("cp " + file_name + ".soft.gz " + file_name + ".soft", shell=True) 
  file = open(file_name+".soft", 'r') 
  sample_text = "!dataset_sample_count"
  lines = file.readlines()
  print "lines[1] ---> " + str(lines[1])

  counter = 0
  print "about to go into loop"

  for line in file:
    print "did not split line"
    split_line = line.split(" ")
    print "split line"
    if counter < 30:
      print line
      print split_line
      print ""
    if split_line[0] == sample_text:
      print "equals sample_text"
      return split_line[2]
    count += 1

#if sys.argv[1] == 'test':
#  print get_random_samples("3104", 50)

      
      

"""
  stop_text = "!dataset_table_begin\n" 
  
  start = 1 
  offset = 2
  stop = len(orig_lines)-1

  train_lines = [orig_lines[0]]
  test_lines = [orig_lines[0]]


  ## find out where the data starts ###
  while orig_lines[start-1] != stop_text:
    train_lines.append(orig_lines[start])
    test_lines.append(orig_lines[start])
    start +=1 

  id_ref_index = 0

  identifier_index = 1

  column_names = str(orig_lines[start])
  #print "column names ---> " + str(column_names)
  column_list = column_names.split()
  first_column = column_names[0]

  sample_list = column_list[offset:]
  num_samples = len(sample_list)

  num_rand_samples = int(threshold * num_samples) 
"""

#def run_test(id, action, split, threshold, disease="obesity"):
#def call_test(id, action, split, threshold, directory, disease="Obesity"):
def call_test(id, action, split, threshold, directory, disease, disease_ids):
  #file = '/scratch/vinnie/GEOPipelineFiles_ubuntu/results/'+disease+'/'+id+'/'+action+'/'+split+'/'+threshold+'/result.output'
#  file = '/scratch/vinnie/GEOPipelineFiles_ubuntu/test.python'
  file = directory + 'result.output'
# file = 'result.write'
  call_process = "nohup cat /scratch/vinnie/GEOPipelineFiles_ubuntu/inputs_GEOpipeline.R | R --vanilla --args " + action + " " + split + " " + id + " " + threshold + " " + disease + " " + disease_ids + " | less > " + file + " &"
#  print "call process ---> " + str(call_process)
#  subprocess.call("nohup cat inputs_GEOpipeline.R | R --vanilla --args " + action + " " + split + " " + id + " " + threshold + " | less > python.test &", shell=True)
  subprocess.call(call_process, shell=True) 

def make_folder(current_directory, folder_name):
  new_folder = current_directory + folder_name + '/'
  subprocess.call("mkdir " + new_folder, shell = True)
  return new_folder

def call_bayes(bayes_type, id, split, threshold, num_folds, directory, disease="obesity", switch=False):
#  file = directory + "result.output"
  file = directory + "test7.output"
  subprocess.call("cd /scratch/vinnie/multinet/multinet/", shell=True)
  subprocess.call("pwd", shell=True)
  args = bayes_type + " " + split + " " + id + " " + threshold + " " + num_folds + " " + disease

  ##
  switch = False
  ##

  if switch == False: 
    #bayes_call = "nohup java BayesBuilder " + bayes_type + " " + split + " " + id + " " + threshold + " " + num_folds + " > " + file + " &"
    print "bayes type ---> " + str(bayes_type)
    #bayes_call = "nohup java BayesBuilder_test " + bayes_type + " " + split + " " + id + " " + threshold + " " + num_folds + " > " + file + " &"
    bayes_call = "nohup java BayesBuilder_test " + args + " > " + file + " &"
  else:
    bayes_call = "nohup java BayesBuilder_switched " + args + " > " + file + " &"
   
  subprocess.call(bayes_call, shell=True)

def call_useful(disease, ids):
  directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs/"
  file = directory + disease + ".log"
  call_process = "nohup cat /scratch/vinnie/GEOPipelineFiles_ubuntu/useful.R | R --vanilla --args " + disease + " " + ids + " | less > " + file + " &"
#  print "call useful ---> " + str(call_process)
  subprocess.call(call_process, shell=True)
  

def run_bayes(bayes_types, split_types, ids, thresholds, num_folds, disease="obesity", switch=False):
  directory = '/scratch/vinnie/multinet/multinet/results/'
  switch = False 
  if switch == False:
    #disease_directory = make_folder(directory, disease) 
    disease_directory = make_folder(directory, disease+'_test') 
  else:
    disease_directory = make_folder(directory, disease+'_switch') 
    

  for bayes_type in bayes_types:
    bayes_directory = make_folder(disease_directory, bayes_type)
    for id in ids:
      id_directory = make_folder(bayes_directory, id)
      for split in split_types:
        split_directory = make_folder(id_directory, split)
        for threshold in thresholds:
	  threshold_directory = make_folder(split_directory, threshold)
	  call_bayes(bayes_type, id, split, threshold, num_folds, threshold_directory, disease)
  


def run_test(useful_ids, actions, split_types, thresholds, disease, disease_ids):
  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/results/'
  #directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/tests/'

  #disease_directory = make_folder(directory, "obesity")
  disease_directory = make_folder(directory, disease)

  for id in useful_ids[:1]:
    id_directory = make_folder(disease_directory, id)
    for action in actions:
      action_directory = make_folder(id_directory, action)
      for split in split_types:
        split_directory = make_folder(action_directory, split)
        for threshold in thresholds:
  	  threshold_directory = make_folder(split_directory, threshold)
  	  call_test(id, action, split, threshold, threshold_directory, disease, disease_ids)

def run_useful(disease):
  ids = get_ids(disease)
#  print "---------- disease ---------"
#  print "ids ---> " + str(ids)
  call_useful(disease, ids)

ids = get_ids(disease="obesity")
#useful_ids = ["3104", "3347", "3423", "3679", "3681"]
#useful_ids = ["3679", "3681"]
useful_ids = ["3104", "3347"]
actions = ["train", "test"]
split_types = ["single", "multi"]
#thresholds = ["30", "50", "80"]
thresholds = ["50", "80"]

bayes_ids = ["3104", "3347", "3679", "3681"]
bayes_types = ["single"]
#test_thresholds = ["50", "80"]
#test_split_types = ["single", "multi"]


#all_thresholds = ["20", "30", "50", "80", "90"]
test_thresholds = ["20"]
test_actions = ["train", "test"] 
test_split_types = ["multi"]

disease_id_gds_dict = {"Obesity": "GDS3104, GDS3347, GDS3423, GDS3679, GDS3681", "Diabetes": "GDS3104, GDS3347, GDS3681, GDS961", "HIV": "GDS1580, GDS1726, GDS2883", "Kidney_Neoplasm": "GDS505, GDS507", "Cell_Transformation_Neoplastic": "GDS2958, GDS3257, GDS3592"}
disease_id_dict = {"Obesity": "3104, 3347, 3423, 3679, 3681", "Diabetes": "3104, 3347, 3681, 961", "HIV": "1580, 1726, 2883", "Kidney_Neoplasm": "505, 507", "Cell_Transformation_Neoplastic": "2958, 3257, 3592"}

#useful_ids = ["3681"]
#actions = ["train"]
#split_types = ["multi"]
#thresholds = ["80"]


#command = sys.argv[1]
#print "command ---> " + str(command)

if len(sys.argv) > 1 and sys.argv[1] == "bayes":
  #run_bayes(bayes_types, test_split_types, useful_ids, test_thresholds, "5") 
  #run_bayes(bayes_types, test_split_types, useful_ids, ["20", "30"], "5") 
  run_bayes(bayes_types, ["multi"], bayes_ids, all_thresholds, "5") 
elif len(sys.argv) > 1 and sys.argv[1] == "bayes_switch":
  #run_bayes(bayes_types, test_split_types, useful_ids, test_thresholds, "5") 
  #disease = "Peritoneal_Disease"
  #diseases = get_disease_id_dict()
  #disease_names = diseases.keys()

  split_types = ["single", "multi"]
  #thresholds = ["30", "50", "80"]
  thresholds = ["10", "20", "30", "40", "50", "60", "70", "80", "90"]
  diseases = get_disease_id_dict()
  disease_names = diseases.keys()

  useful_id_dict = get_disease_useful_id_dict(disease_names)
  useful_disease_names = useful_id_dict.keys()
  useful_disease_names.sort()

  quarter = len(useful_disease_names)/4
  #run_bayes(bayes_types, test_split_types, bayes_ids, all_thresholds, "5", disease="Peritoneal_Disease", switch=True) 
  for current_disease in useful_disease_names[:quarter]:
    disease_ids = useful_id_dict[current_disease]
    disease_id_list = disease_ids.split(",")
    if len(disease_id_list) == 1:
      run_bayes(bayes_types, ["single"], disease_id_list, thresholds, "5", disease=current_disease, switch=True) 
    else:
      run_bayes(bayes_types, split_types, disease_id_list, thresholds, "5", disease=current_disease, switch=True) 
elif len(sys.argv) > 1 and sys.argv[1] == "useful":
  #disease = "Obesity"
  diseases = get_disease_id_dict()
  disease_names = diseases.keys()
  disease_sub = disease_names[:10]

  #for name in disease_names:
  for name in disease_names:
#    print str(name) + " : " + str(diseases[name]) 
    run_useful(name) 
  print str(len(disease_names))

#  useful_dict = get_disease_useful_id_dict(disease_sub)
#  print str("-------- useful dict --------")
#  print str(useful_dict)

#  for disease in disease_names:
#  for disease in disease_sub:
#    run_useful(disease)

#  run_useful(disease)
#  run_useful("Obesity")
else:
#  print "something went wrong!"

  #run_test(useful_ids, actions, split_types, thresholds)
#  run_test(bayes_ids, actions, split_types, ["90"])

   #disease = "Cell_Transformation_Neoplastic"
   actions = ["train", "test"]
   split_types = ["single", "multi"]
   #thresholds = ["30", "50", "80"]
   thresholds = ["10", "20", "30", "40", "50", "60", "70", "80", "90"]
   diseases = get_disease_id_dict()
   disease_names = diseases.keys()

   useful_id_dict = get_disease_useful_id_dict(disease_names)
   useful_disease_names = useful_id_dict.keys()
   useful_disease_names.sort()
   disease_sub = useful_disease_names[:1]
#   print "------ useful id dict[obesity] ------"
#   print str(useful_id_dict["Obesity"])
#   print "len(useful id dict)"
#   print str(len(useful_id_dict))

   quarter = len(useful_disease_names)/4

   #for disease in useful_disease_names[:quarter]: 
   for disease in ["Carcinoma"]: 
#     print "------ disease ------"
#     print str(disease)
     disease_ids = useful_id_dict[disease] 
     disease_id_list = disease_ids.split(",")
#     print "---- disease ids ----"
#     print str(disease_ids)
#     print "disease id list"
#     print str(disease_id_list)
     if len(disease_id_list) == 1:
       run_test(disease_id_list, actions, ["single"], thresholds, disease, disease_ids)
     elif len(disease_id_list) > 1:
       #run_test(disease_id_list, actions, split_types, thresholds, disease, disease_ids)
       run_test(disease_id_list, actions, ["multi"], thresholds, disease, disease_ids)
       

#   print str(useful_id_dict)
#   disease = "Obesity"
#   disease_ids = disease_id_dict[disease].split(", ")
#   run_test(disease_ids, test_actions, test_split_types, test_thresholds, disease, disease_id_gds_dict[disease])

#  for disease in disease_id_dict.keys():
#    if disease != "Obesity":
#      print "-------- " + disease + " --------"
#      disease_ids = disease_id_dict[disease].split(", ")
#      run_test(disease_ids, actions, split_types, all_thresholds, disease, disease_id_dict[disease])

