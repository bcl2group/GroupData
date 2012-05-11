#ifndef K2_H
#define K2_H

#include "Nodepair.h"
#include "Network.h"
#include <vector>
#include <string>
#include <iostream>
#include <algorithm>

using namespace std;

class K2
{
public:

	// Constructor
	K2(int numOfNodes, vector<string> nodes, vector< vector<int> > dataset, int maxParents);
	
	// Methods
	float scoreNetwork(Network n);
	void findParents();
	
protected:
	
	// Declared Variables
	int numOfNodes;
	vector< vector<int> > dataset;
	int maxParents;
	vector< vector<int> > probabilities;
	Network network;
	vector<string> nodes;
	
	// Methods
	float scoringFunction(int i, vector<int> parents);
	int parseCases(int i, int j, int k, vector<int> parents);
	int findCases(vector<int> searchVal);
	int factorial(int integer);
	int valueExists(int value, vector<int> array);
	
	Nodepair findMaxNode(int node, vector<int> predecessors, vector<int> parents);
};

#endif
