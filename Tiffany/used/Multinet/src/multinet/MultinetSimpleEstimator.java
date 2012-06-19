/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package multinet;

import java.util.Enumeration;
import java.util.Vector;
import weka.classifiers.bayes.*;
import weka.classifiers.Classifier;
import weka.classifiers.bayes.net.estimate.DiscreteEstimatorBayes;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.LocalScoreSearchAlgorithm;
import weka.classifiers.bayes.net.search.local.Scoreable;
import weka.classifiers.bayes.net.search.local.TAN;
import weka.core.AdditionalMeasureProducer;
import weka.core.Attribute;
import weka.core.Capabilities;
import weka.core.Drawable;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.Option;
import weka.core.SelectedTag;
import weka.core.Utils;
import weka.core.WeightedInstancesHandler;
import weka.core.Capabilities.Capability;
import weka.filters.Filter;
import weka.filters.supervised.attribute.Discretize;
import weka.filters.unsupervised.attribute.Remove;
import weka.filters.unsupervised.attribute.ReplaceMissingValues;
import weka.filters.unsupervised.instance.RemoveWithValues;

/**
 *
 * @author Kent
 */
public class MultinetSimpleEstimator extends SimpleEstimator {

    /**
     * Extension of {@link SimpleEstimator} which can handle the multinet
     * approach of BayesMultiNetTAN.
     */
    /** for serialization */
    static final long serialVersionUID = 5874941612331806172L;

    /**
     * Returns a string describing this object
     *
     * @return a description of the classifier suitable for displaying in
     *         the explorer/experimenter gui
     */
    public String globalInfo() {
        return "MultiNetSimpleEstimator is used for estimating the "
                + "conditional probability tables of a multinet Bayes "
                + "network once the structure has been learned. Estimates "
                + "probabilities directly from data.";
    }

    /**
     * Calculates the class membership probabilities for the given test
     * instance. For this particular implementation, a single probability is
     * returned, since the MultiNetSimpleEstimator is associated with a
     * single class label.
     *
     * @param bayesNet
     *            the bayes net to use
     * @param instance
     *            the instance to be classified
     * @return predicted class probability distribution
     * @throws Exception
     *             if there is a problem generating the prediction
     */
    public double[] distributionForInstance(BayesNet bayesNet,
            Instance instance) throws Exception {
        
        double logfP = logDist(bayesNet, instance);
        
        return new double[]{Math.exp(logfP)};
    }
    
    protected double logDist(BayesNet bayesNet, Instance instance) {
        double logfP = 0;
        Instances instances = bayesNet.m_Instances;
        for (int iAttribute = 0; iAttribute < instances.numAttributes(); iAttribute++) {
            if (iAttribute == instances.classIndex()) {
                // ignore class index, since this estimator is associated
                // with a single class label
                continue;
            }
            double iCPT = 0;
            
            for (int iParent = 0; iParent < bayesNet.getParentSet(
                    iAttribute).getNrOfParents(); iParent++) {
                int nParent = bayesNet.getParentSet(iAttribute).getParent(
                        iParent);
                
                iCPT = iCPT * instances.attribute(nParent).numValues()
                        + instance.value(nParent);
            }
            
            logfP += Math.log(bayesNet.m_Distributions[iAttribute][(int) iCPT].getProbability(instance.value(iAttribute)));
        }
        return logfP;
    }
}