#include "Inference.h"

using namespace std;

Inference::Inference(Network network)
{
	this->bn = network;
	srand(time(0));							// seed rand

}

double Inference::MCMC_ask(string B, vector<string> e, vector<bool> vals, int iterations)
{
	// Make sure there are the same number of evidence variables as values
	if (e.size() != vals.size()) { throw BadInputException(); }	// throw bad input exception
	int t = 0;
	int f = 0;
	int numOfNodes = bn.getNumOfNodes();
	int indexB = bn.getIndexByName(B);

	vector<int> evidence;

	for (unsigned i = 0; i < e.size(); i++) {
		int index = bn.getIndexByName(e[i]);
		if (index < 0) { throw BadInputException(); }		// throw exception
		evidence.push_back(index);
	}
	
	vector<int> evidence_sorted = evidence;
	sort(evidence_sorted.begin(), evidence_sorted.end());

	for (int j = 0; j < numOfNodes; j++) {
		long max = RAND_MAX;
		x.push_back(rand() <  0.5 * (max + 1));
	}

	for (unsigned k = 0; k < e.size(); k++) {
		x[evidence[k]] = vals[k];
	}
	
	for (int n = 0; n < iterations; n++) {
		for (int m = 0; m < numOfNodes; m++) {
			if (!binary_search(evidence_sorted.begin(), evidence_sorted.end(), m)) {
				double mb = Markov_Blanket(m);
				x[m] = (mb > 0.5);
				if (x[indexB] == true) { t++; }
				else if (x[indexB] == false) { f++; }
			}
		}
	}
	cout << "Inference Probability is " << (double) t/(t+f) << endl;
	return (double) t/(t+f);
}

double Inference::Markov_Blanket(int node) {
	double mb = 1.0;

	vector<int> parents = bn.getParents(node);
	vector<bool> parents_vals;
	for (unsigned i = 0; i < parents.size(); i++) {
		parents_vals.push_back(x[parents[i]]);
	}                            
	double pvNode = bn.getConditionalProbability(parents_vals, node);
	if (pvNode >= 0) {
		mb = mb*pvNode;
	}
        
	vector<int> children = bn.getChildren(node);
	for (unsigned j = 0; j < children.size(); j++) {
		vector<int> c_parents = bn.getParents(children[j]);
		vector<bool> c_parents_vals;
		
		for (unsigned k = 0; k < c_parents.size(); k++)	{
			c_parents_vals.push_back(x[c_parents[k]]);
		}
		double cvNode = bn.getConditionalProbability(c_parents_vals, children[j]);
		if (cvNode >= 0) {
			mb = mb*cvNode;
		}
	}
	cout << "markov_blanket is " << mb << endl;
	return mb;
}

































	
