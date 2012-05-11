#ifndef NETWORK_H
#define NETWORK_H

#include <string>
#include <iostream>
#include <vector>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <sstream>

using namespace std;

class Network
{
public:

	Network();
	Network(int numOfNodes, vector< vector<int> > dataset);
	Network(int numOfNodes, vector<int> genome, vector< vector<int> > dataset);
	void setGenome(vector<int>genome);
	vector<int> setParent(int node, int parent);	
	vector<int> deleteParent(int node, int parent);
	vector<int> getGenome();
	vector<int> getParents(int i);
	bool isParent(int child, int parent);
	void calculateConditionalProbability();
	
	void printProbabilityTables();
	void print();
	
private:
	
	vector<int> genome;
	vector< vector<int> > parents;
	int numOfNodes;
	vector< vector<int> > dataset;
	vector< vector<string> > CP;
	
	void updateParentsList();
	int instanceInDataset(vector<int> array);
	vector<int> getCurrentInstance(int size, int q);
};

#endif
