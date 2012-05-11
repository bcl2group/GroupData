#include "GA.h"

using namespace std;

/**
TODO: 
1. If we change the representation of a genome, we must change the way it's mated
2. Paralellization
3. Saving repeated hits
**/

/**
Runs genetic algorithm
numOfNodes: number of nodes in this network
nodes: vector<string> of node names
dataset: vector< vector<int> > of test cases
maxParents: maximum number of parents each node can have
fileName: name of output file
*/
GA::GA(int numOfNodes, vector<string> nodes, vector< vector<int> > dataset, int maxParents, string fileName):K2(numOfNodes, nodes, dataset, maxParents)
{
	// measure runtime 
	clock_t start;
	double diff;
	start = clock();
	srand(time(0));							// seed rand
	
	// create file
	stringstream fn1;
	string string_filename, about_filename;
	fstream File, About;
	fn1 << "data/" << fileName << time(0)<< endl;
	fn1 >> string_filename;
	about_filename = string_filename + "about.txt";
	string_filename = string_filename + ".gv";
	const char* filename = string_filename.c_str();
	const char* a_filename = about_filename.c_str();
	File.open(filename, ios::out);
	About.open(a_filename, ios::out);
	
	this->numOfNodes = numOfNodes;
	this->dataset = dataset;
	this->size = pow(numOfNodes,2);
	
	Network n1;
	Network n2;
	vector<Network> n = this->makePopulation(10, n1, n2);		// create 10 individuals
	this->networks = n;
	this->nodes = nodes;
	
	this->topNetwork = n1;
	this->nextTopNetwork = n2;
	this->topScore = -1.0f;
	this->nextTopScore = -1.0f;
	
	// output to file and out stream
	//cout << "Genetic algorithm result:" << endl;
	File << "digraph graphname {" << endl;
	
	// run algorithm
	// set depth = 20
	for (int depth = 1; depth <= 20; depth++) {
		//cout << "Round " << depth << endl;
		this->mate(topNetwork, nextTopNetwork);
	}
	
	for (unsigned n = 0; n < nodes.size(); n++) {
		File << n+1 << " [label=\"" << nodes[n] << "\"];" << endl;
	}
	
	vector<int> topGenes = topNetwork.getGenome();

	for (int l = 0; l < numOfNodes; l++) {
		for (int k = 0; k < numOfNodes; k++) {
			if (topGenes[l*numOfNodes + k] == 1) {
				//cout << "Node: " << nodes[l] << ", Parent: " << nodes[k] << endl;
				File << k+1 << " -> " << l+1 << endl;
			}
		}
	}
	
	File << "}" << endl;
	
	topNetwork.printProbabilityTables();
	topNetwork.getConditionalProbability(vb, 1);
	
	//cout << "Score of network: " << topScore << endl;
	About << "Score of network: " << topScore << endl;
	
	// measure runtime
	diff = ( std::clock() - start ) / (double) CLOCKS_PER_SEC;
	//cout<<"Time Taken: "<< diff << endl;
	About<<"Time Taken: "<< diff << endl;
	
	string input = "";
	
	// save file
	/**
	while (true) {
		cout << "Save file? [y/n]: ";
		getline(cin, input);
	
		stringstream myStream(input);
		string sMyStream;
		myStream >> sMyStream;
		if (sMyStream == "y") {
			break;
		} else if (sMyStream == "n") {
			remove(filename);
			remove(a_filename);
			break;
		} else {
			cout << "Could not recognize input. ";
		}
	}
	**/
	File.close();
	About.close();

}

/**
Make initial random population of nodes
numOfInds: number of individuals
n1: set as highest-scoring network
n2: set as second highest-scoring network
*/
vector<Network> GA::makePopulation(int numOfInds, Network& n1, Network& n2)
{
	vector<Network> n;
	for (int num = 0; num < numOfInds; num ++) {
		vector<int> genome;
		
		for (int i = 0; i < numOfNodes; i++) {
			
			for (int j = 0; j < numOfNodes; j++) {
				int random = rand()%2;
				genome.push_back(random);
			}
		}
		
		Network network = Network(numOfNodes, genome, dataset, nodes);
		vector<int> g = network.getGenome();
		cap(g);
		dagify(g);
		network.setGenome(g);
		n.push_back(network);
	}
	
	/**
	// print network genomes
	for (unsigned k = 0; k < n.size(); k++)
	{
		n[k].print();
	}
	*/
	
	// find two highest scoring network
	float highScore = -1.0f;
	Network highNet;
	Network secondHighNet;
	float secondHighScore = -1.0f;
	float score;
	for (unsigned nets = 0; nets < n.size(); nets++) {
		Network network = n[nets];
		
		score = this->scoreNetwork(network);
		if (score > highScore) {
			secondHighScore = highScore;
			secondHighNet = highNet;
			highScore = score;
			highNet = network;
		}
		else if (score <= highScore && score > secondHighScore && \
			highNet.getGenome() != network.getGenome()) {
			secondHighScore = score;
			secondHighNet = network;
		}
	}
	n1 = highNet;
	n2 = secondHighNet;
	
	/**
	// print two highest-scoring genomes
	cerr << "The highest-scoring genome is " n1.print() << " with score " << highScore << endl;
	cerr << "The highest-scoring genome is " n2.print() << " with score " << secondHighScore << endl;
	*/
	
	return n;
}

/** 
Mate two networks, n1 and n2
*/
void GA::mate(Network n1, Network n2)
{
	/**
	cout << "Before mating: " << endl;
	n1.print();
	n2.print();
	cout << " " << endl;
	*/
	
	// crossing over
	long max = RAND_MAX;
	float random = (float) rand()/ (max+1);	// random number from [0,1]
	
	int index = int(random*size);
	vector<int> n1genome = n1.getGenome();
	vector<int> n2genome = n2.getGenome();
	
	vector<int> n1Head = std::vector<int>(n1genome.begin(), n1genome.begin() + index);
	vector<int> n1Tail = std::vector<int>(n1genome.begin() + index, n1genome.end());
	
	vector<int> n2Head = std::vector<int>(n2genome.begin(), n2genome.begin() + index );
	vector<int> n2Tail = std::vector<int>(n2genome.begin()+ index, n2genome.end());
	
	n1Head.insert(n1Head.end(), n2Tail.begin(), n2Tail.end());
	n2Head.insert(n2Head.end(), n1Tail.begin(), n1Tail.end());
	
	vector<int> n1new = n1Head;
	vector<int> n2new = n2Head;
    
	// mutate
	mutate(n1new);
	mutate(n2new);
	
	cap(n1new);
	cap(n2new);
	
	// dagify
	dagify(n1new);
	dagify(n2new);
	
	Network n3 = Network(numOfNodes, n1new, dataset, nodes);
	Network n4 = Network(numOfNodes, n2new, dataset, nodes);
	
	networks.push_back(n3);
	networks.push_back(n4);
	
	// prune population
	while (networks.size() > 10) {
		networks.erase(networks.begin());
	}
	float n3score = this->scoreNetwork(n3);
	float n4score = this->scoreNetwork(n4);
	
	/**
	cout << "After mating: " << endl;
	n3.print();
	n4.print();
	cout << " " << endl;
	*/
	
	//n3.print();
	
	// determine new highest-scoring networks
	if (n3score > topScore) {
		//cout << "Top Node changed.";
		//cout << "" << endl;
		//n3.print();
		//n3.printProbabilityTables();
		nextTopScore = topScore;
		nextTopNetwork = topNetwork;
		topScore = n3score;
		topNetwork = n3;
	}	
	else if (n3score > nextTopScore && n3score != nextTopScore) {
		nextTopScore = n3score;
		nextTopNetwork = n3;
	}
	if (n4score > topScore) {
		//cout << "Top Node changed.";
		//cout << "" << endl;
		//n4.print();
		//n4.printProbabilityTables();
		nextTopScore = topScore;
		nextTopNetwork = topNetwork;
		topScore = n4score;
		topNetwork = n4;
	}
	else if (n4score > nextTopScore && n3score != nextTopScore) {
		nextTopScore = n4score;
		nextTopNetwork = n4;
	}
	
}
/**
mutate genome
*/
void GA::mutate(vector<int> &genome)
{
	/**
	cout << "Before mutation: ";
	
	for (unsigned j = 0; j < genome.size(); j++)
	{
		cerr << genome[j];
	}
	cerr << " " << endl;
	*/
	
	long max = RAND_MAX;
	
	float random1 = (float) rand()/ (max+1);	// random number from [0,1)
	int mutations = int(random1*size*0.5);
	int random2;
	
	int rounds = 2;								// rounds of mutation
	
	for (int i = 0; i < rounds*mutations; i++) {
		random2 = rand()%size;
		genome[random2] = abs(genome[random2]-1);
	}
	
	/**
	cout << "After mutation: ";
	
	for (unsigned k = 0; k < genome.size(); k++)
	{
		cerr << genome[k];
	}
	cerr << " " << endl;
	cerr << " " << endl;
	*/
}

/**
dagify genome
*/
void GA::dagify(vector<int>& genome)
{
	long max = RAND_MAX;
	for (int i = 0; i < numOfNodes; i++) {
		for (int j = 0; j < numOfNodes; j++) {	
			// A node can't be its own parent
			if (i==j) {
				genome[i*numOfNodes + j] = 0;
			}
				
		}
	}
	
        vector<int> visited;
        int start;
        int search;
        
        bool y;
        
        /**
        // print statements
        cerr << "deleting self edges:     ";
        
	for (unsigned a = 0; a < genome.size(); a ++)
	{
		cerr << genome[a];
	}
	cerr << " "<<endl;
	*/
	
        for (int j = 0; j < numOfNodes; j++) {
        	start = j;
        	search = j;
        	y = true;
        	visited.clear();
        	
		while (y) {
			y = depthFirstSearch(start, search, genome, visited);
		}
	}
	
	/**
	// print statements
        cerr << "breaking cycles:         ";
	
	for (unsigned a = 0; a < genome.size(); a ++)
	{
		cerr << genome[a];
		
		if (a > 0 && (a+1) % numOfNodes == 0) {
			cout << " ";
		}
	}
	cerr << " "<<endl;
	*/
	
	// break links that create cycles
	for (int k = 0; k < numOfNodes; k++) {
		int total = 0;
		for (int m = 0; m < numOfNodes; m++) {
			total += genome[k*numOfNodes + m];
		}
		vector<int> isNeighbors;
		for (int l = 0; l < numOfNodes; l++) {
			if (genome[l*numOfNodes + k] == 1)
			{
				isNeighbors.push_back(l);
			}
			
		}
		if (total == 0 && isNeighbors.size() == 0) {
			bool noParent = true;
			while (noParent) {
				float relation = (float) rand()/ (max+1) - 0.5;
				int forcedLink = floor(((float) rand()/ (max+1))*numOfNodes);
				if (forcedLink != k) {
					if (relation >= 0) {
						genome[forcedLink*numOfNodes + k] = 1;
					}
					else if (relation < 0) {
						genome[k*numOfNodes + forcedLink] = 1;
					}
					noParent = false;
				}
			}
		}
	}

	// assign parents to floating nodes
	vector<int> dags;
	for (int h = 0; h < numOfNodes; h++) {
		int total = 0;
		for (int g = 0; g < numOfNodes; g++) {
			total += genome[h*numOfNodes + g];
		}
		if (total == 0) {
			dags.push_back(h);
		}
	}
	
	unsigned links = 0;
	while (links < dags.size() - 1) {
		int randomParent = floor(((float) rand()/ (max+1))*dags.size());
		int randomChild = floor(((float) rand()/ (max+1))*dags.size());
		if (randomParent != randomChild && genome[numOfNodes*dags[randomParent]+dags[randomChild]] != 1 && genome[numOfNodes*dags[randomChild] + dags[randomParent]] != 1) {
			genome[numOfNodes*dags[randomChild] + dags[randomParent]] = 1;
			links++;
		}
	}
	
	/**
	// print statements
        cerr << "connecting stray nodes:  ";
	
	for (unsigned a = 0; a < genome.size(); a ++)
	{
		cerr << genome[a];

		if (a > 0 && (a+1) % numOfNodes == 0) {
			cout << " ";
		}
	}
	cerr << " "<<endl;
	cerr << " "<<endl;
	*/
			
}

/**
cap the number of parents at maxParents
*/
void GA::cap(vector<int>& genome)
{
	long max = RAND_MAX;

	for (int i =0; i < numOfNodes; i++) {
		int count = 0;
		int j = 0;
		while (j < numOfNodes) {
			count += genome[i*numOfNodes + j];
			j++;
		}
		/**
		for (unsigned k = 0; k < genome.size(); k++) {
		      cout << genome[k];
		}
		*/
		if (count > maxParents-1) {
			while (count > maxParents-1) {
				float random = (float) numOfNodes*rand()/ (max+1); // random number from [0, numOfNodes)
				if (genome[i*numOfNodes + floor(random)] == 1) {
					genome[i*numOfNodes + floor(random)] = 0;
					count -= 1;
				}
			}
		}
	}
				
}

/**
use depth first search to find cycles
returns true if found a cycle
start: start node
search: node to search for (usually start node)
dag: genome to search
visited: visited nodes
*/
bool GA::depthFirstSearch(int start, int search, vector<int>& dag, vector<int>& visited)
{
	vector<bool> vectorBooleans;
	if (dag[start*numOfNodes + search] == 1) {
		dag[start*numOfNodes + search] = 0;
		return true;
	}
	
	for (int i = 0; i < numOfNodes; i++) {
		int dag_position = i + start*numOfNodes;
		if (dag[dag_position] == 1) {
			bool hasBeenVisited = false;
			for (unsigned d = 0; d < visited.size(); d++) {
				if (visited[d] == i)
				{
					hasBeenVisited = true;
				}
			}
			if (hasBeenVisited) {
				break;
			}
			visited.push_back(i);
			vectorBooleans.push_back(depthFirstSearch(i, search, dag, visited));
		}
	}
	
	for (unsigned j = 0; j < vectorBooleans.size(); j++) {
		if (vectorBooleans[j] == true)
		{
			return true;
		}
	}
	
	return false;
}

/** 
returns the genome of node i
*/
vector<int> GA::getGenome(int i)
{
	if (i >= (int) networks.size()) {
		vector<int> empty;
		return empty;
	}
	
	return networks[i].getGenome();
}	

/**
check if node i is an element of vector v
*/
bool GA::elementof(int i, vector<int> v)
{
	for (unsigned index = 0; index < v.size(); index++) {
		if (v[index] == i) {
			return true;
		}
	}
	
	return false;
}

Network GA::getTopNetwork()
{
	return topNetwork;
}
