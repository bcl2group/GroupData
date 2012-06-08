## for a particular disease, threshold, num features, and split type, get the accuracy and number of samples
import csv
import sys
import converter
from sets import Set

def get_disease_useful_id_dict(disease_list):
  disease_useful_dict = {}
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

def get_stats(file_name):
	my_file = open(file_name, 'r') 
	lines = my_file.readlines() 
	my_file.close()
	stat_dict = {}
	test_line_check = 'test instances:'
	total_instance_check = 'total instances:'
	test_accuracy_check = '=== Error on test data ==='
	test_instances_line = 0
	total_instances_line = 0
	test_accuracy_line = 0
	line_number = 0
	for line in lines:
#		print "line ---> " + str(line)
		line_number += 1
		if line[:-1] == test_line_check:
			test_instances_line = line_number
		if line[:-1] == total_instance_check:
			total_instances_line = line_number 
		if line[:-1] == test_accuracy_check:
			test_accuracy_line = line_number + 1	
		
	test_instances = lines[test_instances_line][:-1]
	total_instances = lines[total_instances_line][:-1]
	test_accuracy_raw = lines[test_accuracy_line]
	test_accuracy_elements = test_accuracy_raw.split(' ')
#	print "test accuracy raw ---> " + str(test_accuracy_raw)
#	print "test accuracy elements ---> " + str(test_accuracy_elements)
	for i in range(0,len(test_accuracy_elements)-1,):
		index = -1 * (i+2)
		character = test_accuracy_elements[index]
		if character != '':
#			print "index ---> " + str(index)
#			print "character ---> " + str(character)
			test_accuracy = character 
			break
	stat_dict['test instances'] = test_instances
	stat_dict['total instances'] = total_instances
	stat_dict['accuracy'] = test_accuracy
	
	return stat_dict

def parse(data_type, disease,multinet=False):
  thresholds = []
#  writer = csv.writer(open('breast_neoplasm_results_threshold_GDS2745GDS1326.csv', 'a'))
  if multinet == True:
    writer = csv.writer(open('MM_' + disease + '_results_threshold_test_multinet_5.csv', 'a'))
  else:
    writer = csv.writer(open('MM_' + disease + '_results_threshold_test_5.csv', 'a'))

  if data_type == 'single':
  	writer.writerow(['disease', 'integration type', 'experiment', 'threshold', 'features', 'accuracy', 'test instances', 'train instances', 'total_instances']) 

  for i in range(10,100,10):
    thresholds.append(str(i))
  #thresholds = ["80"]
  directory = '/scratch/vinnie/multinet/multinet/attributes_testing_MM/' + disease + '_' + data_type + '/' 
  directory_multi = '/scratch/vinnie/multinet/multinet/attributes_testing_MM/' + disease + '_multi/'

  # split is number of features i think
  #useful_id_dict = get_disease_useful_id_dict(diseases)
  useful_id_dict = get_disease_useful_id_dict([disease])
  disease_ids = useful_id_dict[disease]
  experiments = disease_ids.split(',')
  #experiments = ["GDS1326,GDS3716"]
#  experiments = ["GDS1580", "GDS1726", "GDS2883"]
  #experiments = ["GDS961"]

#  thresholds = ['20','80']
  for threshold in thresholds:
  #for threshold in ["10"]:
  #for experiment in experiments[1:2]:
	print "disease ---> " + disease
	print "data type ---> " + data_type
	#for threshold in thresholds:
#	for threshold in ["10"]:
	for experiment in experiments:
#		print "split ---> " + str(split)
	#for split in range(30,31):
		print "experiment --> " + str(experiment)
#		for threshold in ["30"]:
		for split in range(10,100,10):
#		for split in [90]:
#			print "threshold ---> " + str(threshold)
			if multinet == True:
				file_name = experiment + '_' + threshold + "_" + data_type + "_" + str(split) + '_multinet_result.output'  
			else:
				file_name = experiment + '_' + threshold + "_" + data_type + "_" + str(split) + '_result.output'  
#			file_name = experiment + '_' + threshold + "_" + data_type + "_" + str(split) + '_multinet_result.output'  
			to_open = directory + file_name
			stats = get_stats(to_open) 
			accuracy = stats['accuracy']
			test_instances = stats['test instances']
			total_instances = stats['total instances']
			if total_instances[0] != 'd' or test_instances[0] != 'd': 
				train_instances = int(total_instances) - int(test_instances)
				#writer.writerow([disease, data_type, experiment, threshold, split, accuracy, test_instances, total_instances]) 
				writer.writerow([disease, data_type, experiment, threshold, split, accuracy, train_instances, test_instances, total_instances]) 
				print "stats ---> " + str(stats)
			


#diseases = ["Aneurysm", "Bipolar_Disorder","Carcinoma_Renal_Cell", "Diabetes", "HIV", "Leiomyoma", "Breast_Neoplasm"]
#disease = "Adenocarcinoma" 
#data_type = "multi"
##experiments = ["GDS2838", "GDS731"]
#thresholds = []

#disease = sys.argv[1]
#data_type = sys.argv[2]
#
#parse('single', disease)
#parse('multi', disease)

