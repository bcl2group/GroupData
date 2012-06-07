import csv

#csvReader = csv.reader(open('hiv_results_threshold_first.csv', 'rb'), delimiter=',')
#csvReader = csv.reader(open('breast_neoplasm_results_threshold_multinet.csv', 'rb'), delimiter=',')

current_disease = 'Breast_Neoplasm'
current_split_type = 'single'
current_threshold_list = [x for x in range(10,100,10)]
current_features_list = [x for x in range(10,100,10)]

#current_threshold = current_threshold_list[0]
#current_feature = current_features_list[8]
current_feature = current_threshold_list[8]
#print "current threshold: " + str(current_threshold)
print "current feature: " + str(current_feature)

x_axis_list = current_features_list

#single_feature_accuracy_dict = {}
#multi_feature_accuracy_dict = {}
x_split_type_dict = {}

for x_item in x_axis_list:
  csvReader = csv.reader(open('breast_neoplasm_results_threshold_GDS2745GDS1326.csv', 'rb'), delimiter=',')
  print "x item ---> " + str(x_item)
  single_threshold_accuracy_dict = {}
  single_threshold_train_instances_dict = {}
  single_threshold_test_instances_dict = {}

  multi_threshold_accuracy_dict = {}
  multi_threshold_train_instances_dict = {}
  multi_threshold_test_instances_dict = {}
  for row in csvReader:
    disease = row[0]
    split_type = row[1]
    experiment = row[2]
    threshold = row[3]
    features = row[4]
    accuracy = row[5]
    num_train_samples = row[6]
    num_test_samples = row[7] 


    #if disease == current_disease and threshold == str(current_threshold):
    if disease == current_disease and features == str(x_item):
#    if disease == current_disease and features == str(x_item):
      print "disease ---> " + str(disease)
#    print "split type ---> " + str(split_type)
      print "threhsold ---> " + str(threshold)
      print "features ---> " + str(features)
#    print "accuracy ---> " + str(accuracy)
#    print "experiment ---> " + str(experiment)

   
      #single_keys = single_feature_accuracy_dict.keys()
      #multi_keys = multi_feature_accuracy_dict.keys()
      single_keys = single_threshold_accuracy_dict.keys()
      multi_keys = multi_threshold_accuracy_dict.keys()

#    if split_type == 'single':
#      if features not in single_keys:
#        single_feature_accuracy_dict[features] = []
#      single_feature_accuracy_dict[features].append(float(accuracy))
#    elif split_type == 'multi':
#      if features not in multi_keys:
#        multi_feature_accuracy_dict[features] = []
#      multi_feature_accuracy_dict[features].append(float(accuracy))
      if split_type == 'single':
        if threshold not in single_keys:
          single_threshold_accuracy_dict[threshold] = []
#	  single_threshold_train_instances_dict[features] = 0
#	  single_threshold_test_instances_dict[features] = 0
        single_threshold_accuracy_dict[threshold].append(float(accuracy))
#	single_threshold_train_instances_dict[features] += int(num_train_samples) 
#	single_threshold_test_instances_dict[features] += int(num_test_samples) 

      elif split_type == 'multi':
        if threshold not in multi_keys:
          multi_threshold_accuracy_dict[threshold] = []
#	  multi_threshold_train_instances_dict[features] = 0
#	  multi_threshold_test_instances_dict[features] = 0
        multi_threshold_accuracy_dict[threshold].append(float(accuracy))
#	multi_threshold_train_instances_dict[features] += int(num_train_samples) 
#	multi_threshold_test_instances_dict[features] += int(num_test_samples) 
    


  #single_feature_list = single_feature_accuracy_dict.keys()  
  #single_feature_list.sort()
  single_threshold_list = single_threshold_accuracy_dict.keys()  
  single_threshold_list.sort()

  #multi_feature_list = multi_feature_accuracy_dict.keys()  
  #multi_feature_list.sort()
  multi_threshold_list = multi_threshold_accuracy_dict.keys()  
  multi_threshold_list.sort()

  #directory = '/scratch/vinnie/multinet/multinet/graphs/'
  
  #file_name = current_disease + "_" + str(current_threshold) + "_features_vs_accuracy_new.csv"
  #file_name = current_disease + "_" + str(x_item) + "_features_vs_accuracy_multinet.csv"
  file_name = current_disease + "_features_" + str(x_item) + "_threshold_vs_accuracy_GDS2745-GDS1326.csv"
  
  writer = csv.writer(open(file_name, 'a'))
  #writer.writerow(['single-features', 'single-avg accuracy'])
  #for feature in single_feature_list:
  #    accuracy_list = single_feature_accuracy_dict[feature]
  #  avg_accuracy = float(sum(accuracy_list))/float(len(accuracy_list)) 
  #  writer.writerow([feature, avg_accuracy])

  writer.writerow(['single-threshold', 'single-avg accuracy'])
  print "single threshold list ---> " + str(single_threshold_list)
  for threshold in single_threshold_list:
    print "threshold ---> " + str(threshold)
    accuracy_list = single_threshold_accuracy_dict[threshold]
    print "accuracy list ---> " + str(accuracy_list)
    avg_accuracy = float(sum(accuracy_list))/float(len(accuracy_list)) 
    print "avg accuracy ---> " + str(avg_accuracy)
    writer.writerow([threshold, avg_accuracy])
  
  writer.writerow([])
  #for feature in multi_feature_list:
  #  accuracy_list = multi_feature_accuracy_dict[feature]
  #  avg_accuracy = float(sum(accuracy_list))/float(len(accuracy_list)) 
  #  writer.writerow([feature, avg_accuracy])
  
  writer.writerow(['multi-threshold', 'multi-avg accuracy'])
  print "multi threshold list ---> " + str(multi_threshold_list)
  for threshold in multi_threshold_list:
    print "threshold ---> " + str(threshold)
    accuracy_list = multi_threshold_accuracy_dict[threshold]
    print "accuracy list ---> " + str(accuracy_list)
    avg_accuracy = float(sum(accuracy_list))/float(len(accuracy_list)) 
    print "avg accuracy ---> " + str(avg_accuracy)
    writer.writerow([threshold, avg_accuracy])
