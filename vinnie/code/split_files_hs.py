import sys
import random
import subprocess
from sets import Set
import converter as converter
import control_attribute_selector as control
import parse_results as parser

def make_folder(current_directory, folder_name):
  new_folder = current_directory + folder_name + '/'
  subprocess.call("mkdir " + new_folder, shell = True)
  return new_folder

def get_disease_useful_id_dict(disease_list):
  disease_useful_dict = {}
  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs/'
#  directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs_MM/'
  #directory = '/scratch/vinnie/GEOPipelineFiles_ubuntu/usefulIDs_RN/'
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

def get_start_stop(experiments, lines):
	print "start stop experiments ---> " + str(experiments)
	data_start_line = 0
	experiment_index_dict = {}
	data_start_index = 0
	for line in lines:
		#print "line ---> " + str(line)
		data_start_index += 1
		if line[:-1] == '@DATA':
			data_start_line = data_start_index
			experiment_index_dict['headers'] = data_start_line
			break

	state = None 
	found_start = False
	for i in range(data_start_line-1, len(lines)-1):
		if lines[i+1][0] != lines[i][0]:
			print "in first thing"
			if lines[i+1][0] == 'C' or lines[i+1][0] == '\n':
				print "in second thing"
				if found_start == True:
					print "in found start = true"
#					print "found stop ---> " + str(i)
#					stop = i+1
#					start_stop_dict['stop'] = stop
#					experiment_index_dict[state] = start_stop_dict
#					if len(experiments) > 0:
#						found_start = False
#						state = experiments.pop(0)
					if len(experiments) > 0:
						state = experiments.pop(0)
						print "found stop ---> " + str(i)
						stop = i+1
						start_stop_dict['stop'] = stop
						experiment_index_dict[state] = start_stop_dict
						found_start = False
				if found_start == False:
					print "found start ---> " + str(i)
					start_stop_dict = {}
					start = i+1
					start_stop_dict['start'] = start
					found_start = True

	return experiment_index_dict
	

def pick_remove_lines(start, stop, train_percentage):
	length = stop - start 
	print "length ---> " + str(length)
	test_percentage = float(100 - train_percentage)/float(100)
	print "test percentage ---> " + str(test_percentage)
        num_lines_remove = int(test_percentage*length) 
	print "num  lines remove ---> " + str(num_lines_remove)
	
	## choose lines at random
	random_ints = []
	for i in range(num_lines_remove):
		rand_line = random.randint(start, stop-1)
		while rand_line in random_ints:
			rand_line = random.randint(start, stop-1)
		random_ints.append(rand_line)
	print "random ints ---> " + str(random_ints)
	print "num random ints ---> " + str(len(random_ints))
	print "start ---> " + str(start)
	print "stop ---> " + str(stop)
	return random_ints

def split_experiment(disease_lines, percentage, experiments, disease, experiment_to_split, split_type, remove_lines, start=None, stop=None):
	#lines = disease_file.readlines() 
	lines = disease_lines[:] 
	print "-------------"
	print "len(lines) ---> " + str(len(lines))
	#experiment_list = experiments[:]
	#experiment_list = [experiment_to_split][:]
	experiment_list = experiments[:]
	print "experiment list ---> " + str(experiment_list)
	experiment_index_dict = get_start_stop(experiment_list, lines)
	print "experiment index dict ---> " + str(experiment_index_dict)

        print "experiment list ---> " + str(experiment_list)

#	for experiment in experiments:
	for experiment in [experiment_to_split]:
		print "experiment ---> " + str(experiment)
		print "experiment index dict --> " + str(experiment_index_dict)
#		print "experiment index dict [experiment] ---> " + str(experiment_index_dict[experiment])

#		start = experiment_index_dict[experiment]['start']	
#		stop = experiment_index_dict[experiment]['stop']
#		print "start ---> " + str(start)
#		print "stop ---> " + str(stop)

#		remove_lines = pick_remove_lines(start, stop, percentage)
#		print "remove lines ---> " + str(remove_lines)
#		add_line_list = []

		## create train and test files
#		base_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + experiment + "/"
#		train_directory = base_directory + "train/" + split_type + "/" + str(percentage) + "/"
#		test_directory = base_directory + "test/" + split_type + "/" + str(percentage) + "/"
#		train_file_name = "HS_" + disease + "_" + experiment + "_" + split_type + "_" + str(percentage) + "_train.arff"
#		test_file_name = "HS_" + disease + "_" + experiment + "_" + split_type + "_" + str(percentage) + "_test.arff"
		base_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + experiment_to_split + "/"
		train_directory = base_directory + "train/" + split_type + "/" + str(percentage) + "/"
		print "train directory ---> " + str(train_directory)
		test_directory = base_directory + "test/" + split_type + "/" + str(percentage) + "/"
		print "test directory ---> " + str(test_directory)
		train_file_name = "HS_" + disease + "_" + experiment_to_split + "_" + split_type + "_" + str(percentage) + "_train.arff"
		test_file_name = "HS_" + disease + "_" + experiment_to_split + "_" + split_type + "_" + str(percentage) + "_test.arff"


		## add features etc to the file
		header_stop = experiment_index_dict['headers']
		headers = lines[:header_stop]

		make_folder(base_directory + "train/" + split_type + "/", str(percentage)) 
		make_folder(base_directory, 'test') 
		make_folder(base_directory + "test/", split_type) 
		make_folder(base_directory + "test/" + split_type + "/", str(percentage)) 

		train_file = disease_file = open(train_directory + train_file_name, 'w') 
		test_file = disease_file = open(test_directory + test_file_name, 'w') 
#		train_file = disease_file = open(train_file_name, 'w') 
#		test_file = disease_file = open(test_file_name, 'w') 

#		train_file.writelines(headers)

		test_file.writelines(headers)

		train_lines = []
		test_lines = []
		print "remove_lines ---> " + str(remove_lines)
		print "len(lines) ---> " + str(len(lines))
		test_line_counter = 0
		train_line_counter = 0
		for i in range(len(lines)):
			add_line = lines[i]
			if i in remove_lines:
				test_lines.append(add_line)
				test_line_counter += 1
			else:
				train_lines.append(add_line)
				train_line_counter += 1
		print "test line counter ---> " + str(test_line_counter)
		print "train line counter ---> " + str(train_line_counter)

		test_file.writelines(test_lines)
		train_file.writelines(train_lines)
		test_file.close()
		train_file.close()
	print "done! :)"
	return
	



def split(disease, split_type, disease_id_list):
#	disease_id_list = disease_ids.split(',')
#	disease_id_list = ['GDS1580','GDS1726', 'GDS2883']
#	disease_id_list = ['GDS1580']
	print "disease id list ---> " + str(disease_id_list)
	percentages = [x for x in range(10,100,10)]

	print "disease id list --> " + str(disease_id_list)

	## experiment is "experiment to split"
	for experiment in disease_id_list:
		print "experiment ---> " + str(experiment)

		multi_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + disease_id_list[0] + "/train/multi/100/"
		#multi_file_name = disease_id_list[0] + "_" + disease + "_training_multi_split_singlenet_threshold_100_10percent.txt"
		multi_file_name = disease_id_list[0] + "_" + disease + "_training_multi_split_singlenet_threshold_100_50percent.txt"

		single_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + experiment + "/train/single/100/"
#		single_file_name = experiment + "_" + disease + "_training_single_split_singlenet_threshold_100_10percent.txt"
		single_file_name = experiment + "_" + disease + "_training_single_split_singlenet_threshold_100_50percent.txt"

		#print "directory ---> " + str(directory)
		#print "file name ---> " + str(file_name)

		single_disease_file = open(single_directory + single_file_name, 'r') 
		single_disease_lines = single_disease_file.readlines()
		single_disease_file.close()

		multi_disease_file = open(multi_directory + multi_file_name, 'r') 
		multi_disease_lines = multi_disease_file.readlines()
		multi_disease_file.close()
		
		print "1"
		print "[experiment] ---> " + str([experiment])
		single_experiment_list = [experiment][:]
		multi_experiment_list = disease_id_list[:]

		single_index_dict = get_start_stop(single_experiment_list, single_disease_lines)
		multi_index_dict = get_start_stop(multi_experiment_list, multi_disease_lines)
		print "single index dict ---> " + str(single_index_dict)
		print "multi index dict ---> " + str(multi_index_dict)
		single_start = single_index_dict[experiment]['start'] 
		single_stop = single_index_dict[experiment]['stop']
		multi_start = multi_index_dict[experiment]['start']
		multi_stop = multi_index_dict[experiment]['stop'] 

		length = single_stop - single_start
		print "length ---> " + str(length)
		
		random_int_list = []
		single_rand_int_list = []	
		multi_rand_int_list = []	
		total_percentage = 0.9
		num_lines_total = int(total_percentage * length)
		
		for i in range(num_lines_total):
			rand_int = random.randint(0, length-1)
			while rand_int in random_int_list:
				rand_int = random.randint(0, length-1)
			random_int_list.append(rand_int)
			single_rand_line = single_start + rand_int
			single_rand_int_list.append(single_rand_line)
			multi_rand_line = multi_start + rand_int
			multi_rand_int_list.append(multi_rand_line)

		rand_int_set = Set(random_int_list)
		print "rand int set length ---> " + str(len(rand_int_set))
		print "rand int list length ---> " + str(len(random_int_list))
		
		## get start and stop for this experiment
		## get random lines for this experiment
		for percentage in percentages:
			num_ints = int(float(100 - percentage)/float(100) * length)
			multi_rand_ints = multi_rand_int_list[:num_ints]
			single_rand_ints = single_rand_int_list[:num_ints]
		
			print "percentage ---> " + str(percentage)
			print "num test ints ---> " + str(num_ints)

			print "multi rand ints length ---> " + str(len(multi_rand_ints))
			print "single rand ints length ---> " + str(len(single_rand_ints))

			print "disease id list ---> " + str(disease_id_list)
			#split_experiment(disease_lines, percentage, disease_id_list, disease, experiment, split_type)
			#split_experiment(disease_lines, percentage, disease_id_list, disease, experiment, 'single', remove_lines)

			split_experiment(single_disease_lines, percentage, [experiment], disease, experiment, 'single', single_rand_ints)
			split_experiment(multi_disease_lines, percentage, disease_id_list, disease, experiment, 'multi', multi_rand_ints)

#			split_experiment(multi_disease_lines, percentage, disease_id_list, disease, experiment, 'multi_single', multi_rand_ints, multi_start, multi_stop)

	
#print "experiment index dict ---> " + str(get_start_stop(experiments, lines))
diseases_MM = ['Aging', 'Fibrosis', 'Inflammation', 'Muscular_Dystrophy', 'Carcinoma', 'Hypertrophy', 'Leukemia', 'Neoplasm', 'Obesity']
diseases_RN = ['Diabetes', 'Inflammation', 'Obesity', 'Hypertrophy', 'Neoplasm', 'Tumor']
diseases_HS = ['Aneurysm', 'Bipolar_Disorder', 'Carcinoma_Renal_Cell', 'Diabetes', 'HIV', 'Kidney_Neoplasm', 'Leiomyoma', 'Lung_Neoplasm', 'Breast_Neoplasm']

def get_disease_lines(disease_id_list):
	for experiment in disease_id_list:
		print "experiment ---> " + str(experiment)
		if split_type == 'multi':
			directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + disease_id_list[0] + "/train/" + split_type + "/100/"
			#file_name = disease_id_list[0] + "_" + disease + "_training_" + split_type + "_split_singlenet_threshold_100_10percent.txt"
			file_name = disease_id_list[0] + "_" + disease + "_training_" + split_type + "_split_singlenet_threshold_100_50percent.txt"
		else:
			directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + experiment + "/train/" + split_type + "/100/"
#			file_name = experiment + "_" + disease + "_training_" + split_type + "_split_singlenet_threshold_100_10percent.txt"
			file_name = experiment + "_" + disease + "_training_" + split_type + "_split_singlenet_threshold_100_50percent.txt"

		print "directory ---> " + str(directory)
		print "file name ---> " + str(file_name)
		disease_file = open(directory + file_name, 'r') 
		disease_lines = disease_file.readlines()
		disease_file.close()


def get_experiment_split(disease, split_type):
  useful_id_dict = get_disease_useful_id_dict([disease])
  disease_ids = useful_id_dict[disease] 
  experiment_list = disease_ids.split(',')
  print "experiment list ---> " + str(experiment_list)
#  experiment_list = ['GDS3257', 'GDS3510', 'GDS3592', 'GDS3610']
  
  split(disease, split_type, experiment_list)
  
#  if split_type == 'single':
#    for experiment in experiment_list:
#      split(disease, split_type, [experiment])
#  else:
#    split(disease, split_type, experiment_list)

disease = sys.argv[1]
multinet = False
if len(sys.argv) > 2 and sys.argv[2] == 'multinet':
  multinet = True

get_experiment_split(disease, 'multi')

#control.run_bayes_net(disease, 'single',multinet)	
#control.run_bayes_net(disease, 'multi',multinet)	

#threshold_list = [x for x in range(20,30,10)]
#feature_list = [x for x in range(300, 500, 100)]

#for threshold in threshold_list:
#	for features in feature_list:
##		control.run_bayes_net(disease, 'single', threshold, features, multinet)	
#		control.run_bayes_net(disease, 'multi', threshold, features, multinet)	

parser.parse('single', disease,multinet)
parser.parse('multi', disease,multinet)

