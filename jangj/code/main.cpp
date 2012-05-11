#include "K2.h"
#include "GA.h"
#include "Inference.h"

#include <cassert>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <vector>
#include <string>
#include <stdio.h>
#include <stdlib.h>
#include <float.h>
#include <math.h>
#include <fstream>

using namespace std;

// Globals here.
const int MAX_TOKEN_SIZE = 1024;
FILE* file;
vector<string> Nodes;
vector< vector<int> > dataset;
string fileName;

namespace
{
		// test function for parsing 3-node dataset
        void add3Vector(int i, int j, int k, vector< vector<int> >& set) {
		int ra[3] = {i, j, k};
		vector<int> v(ra, ra+3);

                set.push_back(v);
        }

		// test function for parsing 4-node dataset
        void add4Vector(int i, int j, int k, int m, vector< vector<int> >& set) {
                int ra[4] = {i, j, k, m};
                vector<int> v(ra, ra+4);

                set.push_back(v);
        }
}

int getToken(char token[MAX_TOKEN_SIZE]) 
{
	// for simplicity, tokens must be separated by whitespace
	assert (file != NULL);
	int success = fscanf(file,"%s ", token);
	if (success == EOF) {
		token[0] = '\0';
		return 0;
	}
	
	return 1;
}

/**
load from arff file
*/
void loadInput(const char* filename)
{
	char token[MAX_TOKEN_SIZE];
	vector<int> v;
	bool title = true;
	while (getToken(token)) {
		if (!strcmp(token, "@attribute")) {
			getToken(token);
			if (title) {					// disease is the root of the network
				title = false;
				continue;
			}
			Nodes.push_back(token); 		// string name of gene
		}
		if (!strcmp(token, "@data")) {
			while (getToken(token)) {
				if (strcmp(token, ",")) {
					v.push_back(atoi(token));
				}
			}
		}
	}
	
	int count = 1;
	for (unsigned s = 0; s < v.size(); s+=Nodes.size()) {
		vector<int> newV;
		for (unsigned i = 0; i < Nodes.size(); i++) {
			newV.push_back(v[s+i]);
		}
		dataset.push_back(newV);
		count++;
	}

}

/**
main function
run by: ./K2 followed by arff file name
*/
int main( int argc, char* argv[] )
{	
	const char* filename = NULL;
	if (argc > 1)
	{
		filename = (argv[1]);
		string strfn = string(filename, strlen(filename));
		int start = strfn.rfind("/");
		int stop = strfn.rfind(".");
		fileName = strfn.substr(start+1,stop-start-1);
		
		// parse the file
		assert(filename != NULL);
		const char *ext = &filename[strlen(filename)-4];
		assert(!strcmp(ext,"arff"));
		file = fopen(filename,"r");
		assert (file != NULL);
		loadInput(filename);
		
		fclose(file); 
		file = NULL;
    	}
    	
    	
    	// EXAMPLE 
    	
        vector< vector<int> > dataset;
        
        add3Vector(1, 0, 0, dataset);
        add3Vector(1, 1, 1, dataset);
        add3Vector(0, 0, 1, dataset);        
        add3Vector(1, 1, 1, dataset);
        add3Vector(0, 0, 0, dataset);
        add3Vector(0, 1, 1, dataset);
        add3Vector(1, 1, 1, dataset);
        add3Vector(0, 0, 0, dataset);
        add3Vector(1, 1, 1, dataset);
        add3Vector(0, 0, 0, dataset);
        
        vector<string> nodes;
        for (unsigned d = 0; d < dataset.size(); d++)
        {
		stringstream ss;			//create a stringstream
           	ss << d;				//add number to the stream
        	nodes.push_back("X_" + ss.str());
        }
        
	GA ga = GA(3, nodes, dataset, 2, "noName");
        Inference inference = Inference(ga.getTopNetwork());
	vector<string> E; E.push_back("X_0"); E.push_back("X_2");
	vector<bool> vals; vals.push_back(true); vals.push_back(false);
	inference.MCMC_ask("X_1", E, vals, 5);
	/**
	
	// run GA algorithm
        GA ga = GA(Nodes.size(), Nodes, dataset, 10, fileName);
        Inference inference = Inference(ga.getTopNetwork());
	vector<string> E; E.push_back("MMP16"); E.push_back("ITPR2");
	vector<bool> vals; vals.push_back(true); vals.push_back(false);
	inference.MCMC_ask("TLL2", E, vals, 2);
        */
	/** 
	//run K2 algorithm
        K2 k2 = K2(Nodes.size(), Nodes, dataset, 5);
        k2.findParents();
	*/
        
        return 0;
}
