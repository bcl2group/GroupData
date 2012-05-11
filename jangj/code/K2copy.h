#ifndef K2_H
#define K2_H

#include "Nodepair.h"
#include "Network.h"
#include <vector>
#include <string>
#include <iostream>
#include <vecmath.h>

using namespace std;

class K2
{
public:

	// Constructor
	K2(int numOfNodes, vector< vector<int> > dataset, int maxParents, vector<int> possibleVals);
	
	// Methods
	float scoreNetwork(Network n);
	void findParents();
	
protected:
	float scoringFunction(int i, vector<int> parents);
	int parseCases(int i, int j, int k, vector<int> parents);
	int findCases(vector<int> searchVal);
	int factorial(int integer);
	int valueExists(int value, vector<int> array);
	
	Nodepair findMaxNode(int node, vector<int> predecessors, vector<int> parents);
	
	// Declared Variables
	int numOfNodes;
	vector< vector<int> > dataset;
	vector<int> nodes;
	int maxParents;
	vector< vector<int> > probabilities;
	Network network;
	vector<int> possibleVals;
	
};

#endif
