#include "Network.h"

using namespace std;

/**
TODO: 
1. Model networks without n x n strings
2. Add nodes
3. Find children
**/

Network::Network()
{
	this->numOfNodes = 0;
}

/**
Initialize a network with empty genome
numOfNodes: number of nodes in network
dataset: dataset to learn network over
nodes: names of nodes correspondoing to each node in dataset
**/
Network::Network(int numOfNodes, vector< vector<int> > dataset, vector<string> nodes)
{
	this->numOfNodes = numOfNodes;
	
	vector<int> genome;
	for (int i = 0; i < pow(numOfNodes,2); i++) {
		genome.push_back(0);
	}
	
	this->genome = genome;
	this->dataset = dataset;
	this->nodes = nodes;
	
	this->updateParentsList();
}

/**
Initialize a network
numOfNodes: number of nodes in network
genome: genome of network
dataset: dataset to learn network over
nodes: names of nodes correspondoing to each node in dataset
**/
Network::Network(int numOfNodes, vector<int> genome, vector< vector<int> > dataset, vector<string> nodes)
{
	this->numOfNodes = numOfNodes;
	this->genome = genome;
	this->dataset = dataset;
	this->nodes = nodes;

	this->updateParentsList();
			
}

/**
Set the genome of network
**/
void Network::setGenome(vector<int> genome)
{
	this->genome = genome;
	this->updateParentsList();
}

/**
Build list of parents
**/
void Network::updateParentsList()
{
	vector< vector<int> > parents;
	for (int i = 0; i < numOfNodes; i++) {
		vector<int> p;
		for (int j = 0; j < numOfNodes; j++) {
			if (genome[i*numOfNodes + j] == 1) {
				p.push_back(j);
			}
		}
		parents.push_back(p);
	}
	
	this->parents = parents;
}

/**
Set parent of node
**/
vector<int> Network::setParent(int node, int parent)
{
	this->genome[node * numOfNodes + parent] = 1;
	this->updateParentsList();
	return this->genome;
}

/**
Delete parent of node
**/
vector<int>Network::deleteParent(int node, int parent)
{
	this->genome[node * numOfNodes + parent] = 0;
	this->updateParentsList();
	return this->genome;
}

/**
Return genome of network
**/
vector<int> Network::getGenome()
{
	return genome;
}

/**
Return parents of a node
**/
vector<int> Network::getParents(int i)
{
	return parents[i];
}

/**
Return parents of a node by string name
**/
vector<int> Network::getParentsByName(string node)
{
	int index = getIndexByName(node);
	return getParents(index);
}

/**
Return parents of a node
**/
vector<int> Network::getChildren(int i)
{
	vector< int > children;
	for (int j = 0; j < numOfNodes; j++) {
		if (genome[j*numOfNodes + i]==1) { children.push_back(j); }
	}
	
	return children;
}

/**
Return parents of a node by string name
**/
vector<int> Network::getChildrenByName(string node)
{
	int index = getIndexByName(node);
	return getChildren(index);
}

/**
Return whether or not a node is a parent
**/
bool Network::isParent(int child, int parent)
{
	vector<int> parents = this->getParents(child);
	
	for (unsigned i = 0; i < parents.size(); i++) {
		if (parents[i] == parent)
			return true;
	}
	
	return false;
}

/**
Return whether or not a node is a parent by string name
**/
bool Network::isParentByName(string child, string parent)
{
	int index_child = getIndexByName(child);
	int index_parent = getIndexByName(parent);
	return isParent(index_child, index_parent);
}

/**
Calculate and print probability tables
**/
void Network::printProbabilityTables()
{
	this->calculateConditionalProbability();
	for (unsigned i = 0; i < CP.size(); i++) {
		for (unsigned j = 0; j < CP[i].size(); j++) {
			cerr << CP[i][j] << endl; }
		cerr << " " << endl; 
	}
}

/**
Find the index number of a string node
**/
int Network::getIndexByName(string node)
{
        for (unsigned x = 0; x < nodes.size(); x++) {
                if ((nodes[x]).compare(node)==0) { return x; }
        }
        return -1;
}

/**
Find the string name of an index number
**/
string Network::getNameByIndex(int i)
{
        if (i>0 && (unsigned) i<nodes.size()) { return nodes[i]; }
        return NULL;
}


/**
Print network genome
**/
void Network::print()
{
	for (unsigned i = 0; i < genome.size()-1; i++) {
		cout << genome[i];
	}
	
	cout << genome[genome.size()-1] << endl;
}

/**
Returns the number of nodes in a network
**/
int Network::getNumOfNodes()
{
	return numOfNodes;
}

/**
Returns the nodes in the network
**/
vector<string> Network::getNodes()
{
	return nodes;
}

/**
Gets the conditional probability of a child given values for its parents
vb: instantiated list of child's parents
child: integer node number of child
**/
double Network::getConditionalProbability(vector<bool> vb, int child)
{
	if (getParents(child).size() != vb.size()) { throw BadInputException(); }		// Throw BadInputException

	for (unsigned x = 0; x < allProbabilities[child].size(); x++) {
		if (allProbabilities[child][x].first==vb) {
			return allProbabilities[child][x].second;
		}
	}
	return -1.0;
}

//PRIVATE FUNCTIONS
/**
Calculate conditional probability tables
**/
void Network::calculateConditionalProbability()
{
	vector< vector<string> > conditionalProbabilities;
	vector< vector< pair<vector<bool>, double> > > allProbabilities;
	
	for (int n = 0; n < numOfNodes; n++) {
		vector<int> nParents = this->getParents(n);
		int size = nParents.size();
		vector< pair<vector<bool>, double> > nodeProbabilities;
		if (size == 0) { 
			allProbabilities.push_back(nodeProbabilities);
			continue; 
		}
		vector<string> probabilities;
		vector<int> array;
		
		string stringstr;
		stringstream out;
		out << n;
		stringstr = out.str();
		string table;
		
		// Table formatting
		if (n < 10) { table = "Child " + stringstr + "     "; }
		else if (n >= 10 && n < 100) { table = "Child " + stringstr + "    "; }
		else if (n >= 100 && n < 1000) { table = "Child " + stringstr + "    "; }
		string probability = "p(C | ";
		
		for (int p = 0; p < size; p++) {
			out.str("");
			out << nParents[p];
			stringstr = out.str();
			
			// Table formatting
			if (nParents[p]<10) { table += "Parent " + stringstr + "     "; }
			else if (nParents[p]>=10 && nParents[p]<100) { table += "Parent " + stringstr + "    "; }
			else if (nParents[p]>=100 && nParents[p]<1000) { table += "Parent " + stringstr + "   "; }
			probability += "P_" + stringstr;
			if (p != size-1) probability += ", ";
		}
		
		table += probability + ")";
		probabilities.push_back(table);
		
		for (int r = 0; r < numOfNodes; r++) {
			array.push_back(-1);
		}
		
		int power = pow(2, size);
		
		for (int q = 0; q < power; q++) {
			pair<vector<bool>, double> pairVals;
			vector<bool> vBools;
			
			vector<int> currentInstance = this->getCurrentInstance(size, q);
			for (int s = 0; s < size; s++) {
				for (int m = 0; m < size; m++) {
					array[nParents[m]] = currentInstance[m];
				}
			}
			
			array[n] = 0;
			int t = this->instanceInDataset(array);
			array[n] = 1;
			int f = this->instanceInDataset(array);

			string resultT = "true        ";   
			string resultF = "false       ";

			for (int w = 0; w < size; w++) {
				if (currentInstance[w] == 0) {
					vBools.push_back(false);
					resultT  += "false        ";
					resultF += "false        ";
				}
				else {
					vBools.push_back(true);
					resultT += "true         ";
					resultF += "true         ";
				}
			}
			
			double f1 = 0.0;
			double f2 = 0.0;
			
			if (t == 0 && f == 0) {
				resultT += "none";
				resultF += "none";
			}
			else {
				f1 = (double) t/(t + f);
				out.str("");
				out << f1;
				stringstr = out.str();
				resultT += stringstr;
				
				f2 = (double) f/(t + f);
				out.str("");
				out << f2;
				stringstr = out.str();
				resultF += stringstr;
				
				// Only shows instances that have at least 1 value
				probabilities.push_back(resultF);
				probabilities.push_back(resultT);
				
			}
			
			pairVals.first = vBools;
			pairVals.second = f1;
			
			nodeProbabilities.push_back(pairVals);
			
			/**
			// Shows "none" values as well
			probabilities.push_back(resultF);
			probabilities.push_back(resultT);
			**/
		}
		
		allProbabilities.push_back(nodeProbabilities);
		
		conditionalProbabilities.push_back(probabilities);
	}
	this->allProbabilities = allProbabilities;
	this->CP = conditionalProbabilities;
}

vector<int> Network::getCurrentInstance(int size, int q)
{
	int qcopy = q;
	vector<int> instance;
	for (int i = 0; i < size; i ++) {
		if (qcopy % 2 == 0) {
			instance.push_back(0);
		}
		else {
			instance.push_back(1);
		}
		qcopy = qcopy/2;
	}
	return instance;
}
			
int Network::instanceInDataset(vector<int> array)
{
	int instances = 0;
	for (unsigned i = 0; i < dataset.size(); i++) {
		vector<int> compare = dataset[i];
		for (int j = 0; j < numOfNodes; j++) {
			if (compare[j] != array[j] && array[j] != -1)
			{
				instances -= 1;
				break;
			}
		}
		instances++;
	}
	return instances;
}
