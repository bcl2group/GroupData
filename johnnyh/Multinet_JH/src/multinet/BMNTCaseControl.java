/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package multinet;

import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.local.LocalScoreSearchAlgorithm;
import weka.core.Attribute;
import weka.core.FastVector;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SelectedTag;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Discretize;
import weka.filters.unsupervised.attribute.Remove;
import weka.filters.unsupervised.instance.RemoveWithValues;

/**
 * The value for control in the class attribute in Instances must be "1N."
 * The phenotypes of the Instances supplied to buildClassifier() should be
 * differentiated (i.e. one for each comorbidity), but Instance objects 
 * supplied to distributionForInstance() should not (just "1N" for control 
 * and "2N" or something else for case). 
 * @author Teslin
 */
public class BMNTCaseControl extends BayesMultiNet {

    private BayesNet combiner;
    private Instances combinerTrain;
    private FastVector attributesFv;
    private static final String CNTL = "1N";
    private static final String CASE = "2N";

    @Override
    protected void initializeEstimators(int numClasses) {
        m_Estimators = new BMNTCCMultiNetSimpleEstimator[numClasses];
        for (int iClass = 0; iClass < numClasses; ++iClass) {
            m_Estimators[iClass] = new BMNTCCMultiNetSimpleEstimator();
            m_Estimators[iClass].setAlpha(m_fAlpha);
        }
    }

    @Override
    public void buildClassifier(Instances instances) throws Exception {
        // can classifier handle the data?
        getCapabilities().testWithFail(instances);

        // remove instances with missing class
        instances = new Instances(instances);
        instances.deleteWithMissingClass();

        // ensure we have a data set with discrete variables only and with no
        // missing values
        instances = normalizeDataSet(instances);

        // copy instances to local field
//              m_Instances = new Instances(instances);
        m_Instances = instances;

        // initialize arrays
        int numClasses = m_Instances.classAttribute().numValues();
        m_Structures = new BayesNet[numClasses];
        m_cInstances = new Instances[numClasses];
        // m_cEstimator = new DiscreteEstimatorBayes(numClasses, m_fAlpha);

        for (int iClass = 0; iClass < numClasses; iClass++) {
            splitInstances(iClass);
        }

        // update probabilty of class label, using Bayesian network associated
        // with the class attribute only
        Remove rFilter = new Remove();
        rFilter.setAttributeIndices("" + (m_Instances.classIndex() + 1));
        rFilter.setInvertSelection(true);
        rFilter.setInputFormat(m_Instances);
        Instances classInstances = new Instances(m_Instances);
        classInstances = Filter.useFilter(classInstances, rFilter);

        m_cEstimator = new BayesNet();
        SimpleEstimator classEstimator = new SimpleEstimator();
        classEstimator.setAlpha(m_fAlpha);
        m_cEstimator.setEstimator(classEstimator);
        m_cEstimator.buildClassifier(classInstances);

        /*combiner = new LibSVM(); 
        FastVector classFv = new FastVector(2);
        classFv.addElement(CNTL);
        classFv.addElement(CASE);
        Attribute classAt = new Attribute(m_Instances.classAttribute().name(), 
        classFv);
        attributesFv = new FastVector(m_Structures.length);
        attributesFv.addElement(classAt);
        for (int i = 0; i < m_Instances.classAttribute().numValues(); i++){
        if (!m_Instances.classAttribute().value(i).equals(CNTL))
        attributesFv.addElement(new Attribute(m_Instances.classAttribute
        ().value(i)));
        }
        combinerTrain = new Instances("combinertrain", attributesFv, 
        m_Instances.numInstances());
        combinerTrain.setClassIndex(0);
        for (int i = 0; i < m_Instances.numInstances(); i++){
        double[] probs = super.distributionForInstance(m_Instances.instance(i));
        Instance result = new Instance(attributesFv.size()); 
        if (!m_Instances.classAttribute().value(m_Instances.instance(i).
        classIndex()).equals(CNTL))
        result.setValue(classAt, CASE);
        else
        result.setValue(classAt, CNTL);
        for (int j = 0; j < attributesFv.size(); j++){
        if (!attributesFv.elementAt(j).equals(classAt)){
        Attribute current = (Attribute) attributesFv.elementAt(j);
        result.setValue(current, 
        probs[m_Instances.classAttribute().indexOfValue
        (current.name())]);
        }
        }
        combinerTrain.add(result);
        }
        combinerTrain = discretize(combinerTrain);
        combiner.buildClassifier(combinerTrain);*/
    }

    private Instances discretize(Instances i) throws Exception {
        String[] options = new String[4];
        options[0] = "-B"; //bins
        options[1] = "100";
        options[2] = "-R"; //range
        options[3] = "2-last"; //indices start from 1.
        Discretize dis = new Discretize();
        dis.setOptions(options);
        dis.setInputFormat(i);
        return Filter.useFilter(i, dis);
    }

    public void splitInstances(int iClass) throws Exception {
        // filter all instances with a particular class label
        RemoveWithValues rmvFilter = new RemoveWithValues();
        rmvFilter.setAttributeIndex("" + (m_Instances.classIndex() + 1));
        rmvFilter.setInvertSelection(true);
        rmvFilter.setNominalIndicesArr(new int[]{iClass});
        rmvFilter.setInputFormat(m_Instances);
//                      m_cInstances[iClass] = new Instances(m_Instances);
//                      m_cInstances[iClass] = Filter.useFilter(m_cInstances[iClass],
//                                      rmvFilter);
        m_cInstances[iClass] = Filter.useFilter(m_Instances, rmvFilter);

        // generate tree structure for this class label, based on Chow and
        // Liu's greedy search
        int numClasses = m_Instances.classAttribute().numValues();
        MultiNet tan = new MultiNet();
        tan.setScoreType(new SelectedTag(m_nScoreType,
                LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        initializeEstimators(numClasses);
        m_Structures[iClass] = new BayesNet();

        m_Estimators[iClass].setAlpha(m_fAlpha);
        ((BayesNet) m_Structures[iClass]).setSearchAlgorithm(tan);
        ((BayesNet) m_Structures[iClass]).setEstimator(m_Estimators[iClass]);
        m_Structures[iClass].buildClassifier(m_cInstances[iClass]);

        // update probability of this class label
        // Enumeration enumInsts =
        // m_cInstances[iClass].enumerateInstances();
        // int classIndex = m_Instances.classIndex();
        // while (enumInsts.hasMoreElements()) {
        // Instance instance = (Instance) enumInsts.nextElement();
        // m_cEstimator.addValue(instance.value(classIndex),
        // instance.weight());
        // }        
    }

    public double[] distributionForInstance(BayesNet bayesNet,
            Instance instance) throws Exception {

        double logfP = logDist(bayesNet, instance);
        return new double[]{Math.exp(logfP)};
    }

    private double logDist(BayesNet bayesNet, Instance instance) {
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

            Attribute attribute = (Attribute) instances.attribute(iAttribute);
            logfP += Math.log(bayesNet.m_Distributions[iAttribute][(int) iCPT].getProbability(instance.value(attribute)));
        }
        return logfP;
    }

    public Instances constructTestDistributions(Instances test) throws Exception {
        Instances combinerTest = new Instances("combinertest", attributesFv,
                m_Instances.numInstances());
        for (int h = 0; h < test.numInstances(); h++) {
            Instance instance = test.instance(h);
            double[] fProbs = super.distributionForInstance(instance);
            Instance copy = new Instance(fProbs.length);
            for (int i = 0; i < attributesFv.size(); i++) {
                Attribute current = (Attribute) attributesFv.elementAt(i);
                if (current.name().equals(m_Instances.classAttribute().name())) {
                    copy.setValue(current, instance.stringValue(instance.classIndex()).equals(CNTL) ? CNTL : CASE);
                } else {
                    copy.setValue(current, fProbs[m_Instances.classAttribute().
                            indexOfValue(current.name())]);
                }
            }
            combinerTest.add(copy);
        }
        //combinerTest = discretize(combinerTest);
        combinerTest.setClassIndex(0);
        return combinerTest;
    }

    public Instances getTrainDistributions() {
        return combinerTrain;
    }

    public BayesNet getCombiner() {
        return combiner;
    }
}