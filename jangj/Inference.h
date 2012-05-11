#ifndef INFERENCE_H
#define INFERENCE_H

#include <string>
#include <iostream>
#include <math.h>

using namespace std;

class Inference 
{
public:

	Inference(Network network);
	MCMC_ask();

private:
	Network bn;
	
};

#endif
