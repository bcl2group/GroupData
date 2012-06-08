import subprocess
from sets import Set
import converter
import parse_results
import sys

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

def run_bayes_net(disease, data_type,multinet=False):
#def run_bayes_net(disease, data_type, threshold, features, multinet=False):
  thresholds = []
  for i in range(10,100,10):
  #for i in range(0,100,10):
#  for i in [threshold]:
    thresholds.append(str(i))

  useful_id_dict = get_disease_useful_id_dict([disease])
  disease_ids = useful_id_dict[disease]
  experiments = disease_ids.split(',')

  result_directory = '/scratch/vinnie/multinet/multinet/attributes_testing/' + disease + '_' + data_type + '/' 

  #for split in range(10,100,10):
  #for split in range(100,1600,100):
  for split in range(100,1100,100):
  #for split in [features]:
  #for split in range(10,20,10):
# split is number of features i think
	print "disease ---> " + disease
	print "data type ---> " + data_type
	#for experiment in experiments[1:2]:
	for experiment in experiments:
		for threshold in thresholds:
			print "experiment ---> " + experiment
			#call_process = "nohup java attribute_selector_ranker " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > /scratch/vinnie/multinet/multinet/attributes_testing/Adenocarcinoma_single/test_5.output &"
			if multinet == True:
				file_name = experiment + '_' + threshold + "_" + data_type + "_" + str(split) + '_multinet_result.output'  
				to_save = result_directory + file_name
				call_process = "java attribute_selector_ranker_multinet " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > " + to_save 
			else:
				file_name = experiment + '_' + threshold + "_" + data_type + "_" + str(split) + '_result.output'  
				to_save = result_directory + file_name
				call_process = "java -Xmx12G attribute_selector_ranker " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > " + to_save  
				#call_process = "java attribute_selector_optimizer " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > " + to_save 
				#call_process = "java attribute_selector_optimizer " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > test_optimizer.output" 
			#call_process = "nohup java attribute_selector_ranker " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > test_5.output &"
			#call_process = "nohup java attribute_selector_ranker " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > " + to_save + " &"
			#call_process = "nohup java attribute_selector_ranker " + str(split) + " " + disease + " " + experiment+ " " + data_type + " " + threshold + " > " + to_save + " &"
			subprocess.call(call_process, shell=True)

#disease = "HIV"
#data_type = "single"

#
#run_bayes_net(disease, 'single')	
#run_bayes_net(disease, 'multi')	
#
#parse_results.parse(disease, 'single')
#parse_results.parse(disease, 'multi')


