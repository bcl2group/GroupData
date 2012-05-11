#ifndef NETWORK_H
#define NETWORK_H

#include <string>
#include <iostream>
#include <vector>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <sstream>
#include "BadInputException.h"

using namespace std;

class Network
{
public:
	
	Network();
	Network(int numOfNodes, vector< vector<int> > dataset, vector<string> nodes);
	Network(int numOfNodes, vector<int> genome, vector< vector<int> > dataset, vector<string> nodes);
	void setGenome(vector<int>genome);
	vector<int> setParent(int node, int parent);	
	vector<int> deleteParent(int node, int parent);
	vector<int> getGenome();
	vector<int> getParents(int i);
	vector<int> getParentsByName(string node);
	vector<int> getChildren(int i);
	vector<int> getChildrenByName(string node);
	bool isParent(int child, int parent);
	bool isParentByName(string child, string parent);
	int getNumOfNodes();
	vector<string> getNodes();
	int getIndexByName(string node);
        string getNameByIndex(int i);
	double getConditionalProbability(vector<bool> vb, int child);
	
	void printProbabilityTables();
	void print();
	
private:
	
	vector<int> genome;
	vector< vector<int> > parents;
	int numOfNodes;
	vector< vector<int> > dataset;
	vector< vector<string> > CP;
	vector<string> nodes;
	vector< vector< pair<vector<bool>, double> > > allProbabilities;
	
	void updateParentsList();
	int instanceInDataset(vector<int> array);
	vector<int> getCurrentInstance(int size, int q);
	void calculateConditionalProbability();
	//void createConditionalProbabilityTables();
};

#endif
