import sys
import control_attribute_selector as bayes 
import parse_results 

disease = sys.argv[1]

data_types = ['single', 'multi']

for data_type in data_types:
  bayes.run_bayes_net(disease, data_type)
  parse_results.parse(disease, data_type)
  
## now run analysis
