import random


def get_start_stop(experiments, lines):
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
			if lines[i+1][0] == 'C' or lines[i+1][0] == '\n':
				if found_start == True:
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

def split_experiment(disease_file, percentage, experiments, disease):
	lines = disease_file.readlines() 
	experiment_list = experiments[:]
	experiment_index_dict = get_start_stop(experiments, lines)

	for experiment in experiment_list:
		start = experiment_index_dict[experiment]['start']	
		stop = experiment_index_dict[experiment]['stop']

		remove_lines = pick_remove_lines(start, stop, percentage)
		add_line_list = []

		## create train and test files
		train_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/" + disease + "_binarize/" + experiment + "/train/multi/" + str(percentage) + "/"
		test_directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/" + disease + "_binarize/" + experiment + "/test/multi/" + str(percentage) + "/"
		train_file_name = experiment + "_" + str(percentage) + "_train.arff"
		test_file_name = experiment + "_" + str(percentage) + "_test.arff"


		## add features etc to the file
		header_stop = experiment_index_dict['headers']
		headers = lines[:header_stop]

		#train_file = disease_file = open(train_directory + train_file_name, 'w') 
		#test_file = disease_file = open(test_directory + test_file_name, 'w') 
		train_file = disease_file = open(train_file_name, 'w') 
		test_file = disease_file = open(test_file_name, 'w') 

#		train_file.writelines(headers)
		test_file.writelines(headers)

		train_lines = []
		test_lines = []
		for i in range(len(lines)):
			add_line = lines[i]
			if i in remove_lines:
				test_lines.append(add_line)
			else:
				train_lines.append(add_line)
		test_file.writelines(test_lines)
		train_file.writelines(train_lines)
		test_file.close()
		train_file.close()
	print "done! :)"
	return
	
	
#print "experiment index dict ---> " + str(get_start_stop(experiments, lines))
experiments = ['GDS1326,GDS1664']
disease = 'Breast_Neoplasm'
directory = "/scratch/vinnie/GEOPipelineFiles_ubuntu/results/" + disease + "_binarize/" + experiments[0] + "/train/multi/100/"
file_name = experiments[0] + "_" + disease + "_training_multi_split_singlenet_threshold_100_10percent.txt"
disease_file = open(directory + file_name, 'r') 

#print "experiments ---> " + str(experiments)
split_experiment(disease_file, 50, experiments, disease)
disease_file.close()
