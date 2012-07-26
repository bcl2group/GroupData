package JH;

import weka.core.*;
import weka.filters.*;
import multinet.*;

public class BayesMultiNet_filtered extends BayesMultiNet {
	Filter filter;
	public static final int topn = 3000;

	public void buildClassifier(Instances instances) throws Exception {
		filter = topDiff_JH.runTopDiff(instances, topn);
		Instances sub = Filter.useFilter(instances, filter);
		sub.setClassIndex(0);
		super.buildClassifier(sub);
	}

	public double[] distributionForInstance(Instance instance) throws Exception {
		filter.input(instance);
		return super.distributionForInstance(filter.output());
	}
}