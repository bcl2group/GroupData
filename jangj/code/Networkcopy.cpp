#include "Network.h"

using namespace std;

Network::Network()
{
	this->numOfNodes = 0;
}

Network::Network(int numOfNodes, vector< vector<int> > dataset)
{
	this->numOfNodes = numOfNodes;
	
	vector<int> genome;
	
	for (int i = 0; i < pow(numOfNodes,2); i++)
	{
		genome.push_back(0);
	}
	
	this->genome = genome;
	this->dataset = dataset;
	
	this->updateParentsList();
}

Network::Network(int numOfNodes, vector<int> genome, vector< vector<int> > dataset)
{
	this->numOfNodes = numOfNodes;
	this->genome = genome;
	this->dataset = dataset;

	this->updateParentsList();
			
}

void Network::setGenome(vector<int> genome)
{
	this->genome = genome;
	this->updateParentsList();
}

void Network::updateParentsList()
{
	vector< vector<int> > parents;
	
	for (int i = 0; i < numOfNodes; i++)
	{
		vector<int> p;
		
		for (int j = 0; j < numOfNodes; j++)
		{
			if (genome[i*numOfNodes + j] == 1)
			{
				p.push_back(j);
			}
		}
		
		parents.push_back(p);
	}
	
	this->parents = parents;
}

vector<int> Network::setParent(int node, int parent)
{
	this->genome[node * numOfNodes + parent] = 1;
	this->updateParentsList();
	return this->genome;
}

vector<int>Network::deleteParent(int node, int parent)
{
	this->genome[node * numOfNodes + parent] = 0;
	this->updateParentsList();
	return this->genome;
}

vector<int> Network::getGenome()
{
	return genome;
}

vector<int> Network::getParents(int i)
{
	return parents[i];
}

bool Network::isParent(int child, int parent)
{
	vector<int> parents = this->getParents(child);
	
	for (unsigned i = 0; i < parents.size(); i++)
	{
		if (parents[i] == parent)
		{
			return true;
		}
	}
	
	return false;
}

void Network::calculateConditionalProbability()
{
	vector< vector<string> > conditionalProbabilities;
	
	for (int n = 0; n < numOfNodes; n++)
	{
		vector<int> nParents = this->getParents(n);
		int size = nParents.size();
		
		if (size == 0)
		{
			continue;
		}
		
		vector<string> probabilities;
		vector<int> array;
		
		string stringstr;
		stringstream out;
		out << n;
		stringstr = out.str();
		
		string table = "Child " + stringstr + "     ";
		
		for (int p = 0; p < size; p++)
		{
			out.str("");
			out << p;
			stringstr = out.str();
			table = table + "Parent " + stringstr + "     ";
		}
		
		table = table + "Probability";
		probabilities.push_back(table);
		
		for (int r = 0; r < numOfNodes; r++)
		{
			array.push_back(-1);
		}
		
		int power = pow(2, size);
		
		for (int q = 0; q < power; q++)
		{
			vector<int> currentInstance = this->getCurrentInstance(size, q);
			
			for (int s = 0; s < size; s++)
			{
				
				for (int m = 0; m < size; m++)
				{
					array[nParents[m]] = currentInstance[m];
				}
				
			}
		
			array[n] = 0;
			int t = this->instanceInDataset(array);
			array[n] = 1;
			int f = this->instanceInDataset(array);
			
			string resultT = "true     ";   
			string resultF = "false     ";
			
			for (int w = 0; w < size; w++)
			{
				if (currentInstance[w] == 0)
				{
					resultT = resultT + "false     ";
					resultF = resultF + "false     ";
				}
				else
				{
					resultT = resultT + "true     ";
					resultF = resultF + "true     ";
				}
			}
			
			float f1 = (float) t/(t + f);
			out.str("");
			out << f1;
			stringstr = out.str();
			resultT = resultT + stringstr;
			
			float f2 = (float) f/(t + f);
			out.str("");
			out << f2;
			stringstr = out.str();
			resultF = resultF + stringstr;
			
			probabilities.push_back(resultT);
			probabilities.push_back(resultF);
		}
		
		conditionalProbabilities.push_back(probabilities);
	}
	
	this->CP = conditionalProbabilities;
}

vector<int> Network::getCurrentInstance(int size, int q)
{
	int qcopy = q;
	vector<int> instance;
	
	for (int i = 0; i < size; i ++)
	{
		if (qcopy % size == 0)
		{
			instance.push_back(0);
		}
		else 
		{
			instance.push_back(1);
		}
		qcopy = qcopy/2;
	}

	return instance;
}
			
int Network::instanceInDataset(vector<int> array)
{
	int instances = 0;
	
	for (unsigned i = 0; i < dataset.size(); i++)
	{
		for (unsigned j = 0; j < array.size(); j++)
		{
			if ((array[j] != -1) && (dataset[i][j] != array[j]))
			{
				return -1;
			}
		}
			
		instances++;
	}
	
	return instances;
}

void Network::printProbabilityTables()
{
	for (unsigned i = 0; i < CP.size(); i++)
	{
		for (unsigned j = 0; j < CP[i].size(); j++)
		{
			cerr << CP[i][j] << endl;
		}
		
		cerr << " " << endl;
	}
}

void Network::print()
{
	for (unsigned i = 0; i < genome.size()-1; i++)
	{
		cout << genome[i];
	}
	
	cout << genome[genome.size()-1] << endl;
}
