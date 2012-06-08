package multinet;

/*
 * Usage steps:
 *
 * 1. Load data files in CSV or ARFF (Weka's internal format, preferred) to Instances objects. For loading from CSV,
 * see
 *
 * http://weka.wikispaces.com/Converting+CSV+to+ARFF
 *
 * For a description of the ARFF format, see
 *
 * http://www.cs.waikato.ac.nz/~ml/weka/arff.html
 *
 * For loading from ARFF, see
 *
 * http://weka.wikispaces.com/Use+WEKA+in+your+Java+code
 *
 * 2. Run the multinet as follows:
 * (assuming you have separate testing and training data)
 *
 * Instances train = ...	// load training and testing data as in first step
 * Instances test = ...
 *
 * Evaluation eval = new Evaluation(train);	// evaluator for testing power of classifier
 * BayesMultiNetTAN multinet = new BayesMultiNetTAN();
 * multinet.buildClassifier(train);	// train the multinet
 * eval.evaluateModel(multinet, test);	// test the multinet
 *
 * return eval.weightedAreaUnderROC();	// AUROC for the given testing and training data
 */
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
 * <!-- globalinfo-start --> Multinet implementation of the TAN Bayesian
 * classifier, as initially described by Chow and Liu (1968). Much of this
 * implementation is taken from weka.classifiers.bayes.BayesNet.java. <br/>
 * For more information see:<br/>
 * <br/>
 * N. Friedman, D. Geiger, M. Goldszmidt (1997). Bayesian network classifiers.
 * Machine Learning. 29(2-3):131-163.
 * <p/>
 * <!-- globalinfo-end -->
 *
 * <!-- options-start --> Valid list of options:
 * <p/ >
 *
 * <pre>
 * -C &lt;num&gt;
 *  Choose index of class label whose structure will be displayed in Weka
 *  GUI (defaults to 0).
 * </pre>
 *
 * <pre>
 * -A &lt;num&gt;
 *  Initial count (alpha), defaults to 0.5.
 * </pre>
 *
 * <pre>
 * -S [BAYES|BDeu|MDL|ENTROPY|AIC]
 *  Score type (BAYES, BDeu, MDL, ENTROPY and AIC)
 * </pre>
 *
 * <!-- options-end -->
 *
 * @author Kent Huynh (khuynh@mit.edu)
 */
public class BayesMultiNetTAN extends Classifier implements
        WeightedInstancesHandler, Drawable, AdditionalMeasureProducer {

    /**
     * Serializable ID corresponding to this version.
     */
    private static final long serialVersionUID = -3627939878682572986L;
    /**
     * The dataset header for the purposes of printing out a semi-intelligible
     * model
     */
    public Instances m_Instances;
    /**
     * Set of instances corresponding to each class label.
     */
    Instances[] m_cInstances;
    /** filter used to quantize continuous variables, if any **/
    protected Discretize m_DiscretizeFilter = null;
    /** attribute index of a non-nominal attribute */
    int m_nNonDiscreteAttribute = -1;
    /** filter used to fill in missing values, if any **/
    protected ReplaceMissingValues m_MissingValuesFilter = null;
    /**
     * Array of Bayesian networks for each class.
     */
    BayesNet[] m_Structures;
    /**
     * Estimators associated with each structure.
     */
    MultinetSimpleEstimator[] m_Estimators;
    // /**
    // * Estimator associated with the class attribute.
    // */
    // DiscreteEstimatorBayes m_cEstimator;
    /**
     * Estimator associated with the class attribute, represented as a BayesNet
     * with only one attribute. This allows easy computation of the class
     * probability density as well as the score.
     */
    BayesNet m_cEstimator;
    /**
     * Index of the class label to display the Bayesian structure associated
     * with this label. This defaults to the first class.
     */
    int m_cDisplay = 0;
    /**
     * Holds prior on count
     */
    protected double m_fAlpha = 0.5;
    /**
     * Holds the score type used to measure quality of network
     */
    int m_nScoreType = Scoreable.BAYES;

    /**
     * This will return a string describing the classifier.
     *
     * @return The string.
     */
    public String globalInfo() {
        return "Bayes classifier using the TAN algorithm of Chow and Liu (1968)"
                + " with a multinet approach (constructing separate"
                + " structures for each class).";
    } // globalInfo

    /**
     * Returns an enumeration describing the available options
     *
     * @return an enumeration of all the available options
     */
    public Enumeration listOptions() {
        Vector<Option> newVector = new Vector<Option>(1);

        newVector.addElement(new Option(
                "Initial count (alpha), defaults to 0.5.", "A", 1, "-A <num>"));
        newVector.addElement(new Option(
                "\tChoose class label index whose structure is displayed graphically (defaults to first).",
                "C", 1, "-C <index>"));
        newVector.addElement(new Option(
                "\tScore type (BAYES, BDeu, MDL, ENTROPY and AIC)", "S", 1,
                "-S [BAYES|BDeu|MDL|ENTROPY|AIC]"));
        return newVector.elements();
    } // listOptions

    /**
     * Parses a given list of options.
     * <p>
     *
     * <!-- options-start --> Valid list of options:
     * <p/ >
     *
     * <pre>
     * -C &lt;num&gt;
     *  Choose index of class label whose structure will be displayed in Weka
     *  GUI (defaults to 0).
     * </pre>
     *
     * <!-- options-end -->
     *
     * @param options
     *            the list of options as an array of strings
     * @throws Exception
     *             if an option is not supported
     */
    public void setOptions(String[] options) throws Exception {
        // set alpha value
        String sAlpha = Utils.getOption('A', options);
        if (sAlpha.length() != 0) {
            m_fAlpha = (new Float(sAlpha)).floatValue();
        } else {
            m_fAlpha = 0.5f;
        }

        // set display index
        String sDisplay = Utils.getOption('C', options);
        if (sDisplay.length() != 0) {
            m_cDisplay = (new Integer(sDisplay)).intValue();
        } else {
            m_cDisplay = 0;
        }

        // set scoring scheme
        String sScore = Utils.getOption('S', options);
        if (sScore.compareTo("BAYES") == 0) {
            setScoreType(new SelectedTag(Scoreable.BAYES,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        }
        if (sScore.compareTo("BDeu") == 0) {
            setScoreType(new SelectedTag(Scoreable.BDeu,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        }
        if (sScore.compareTo("MDL") == 0) {
            setScoreType(new SelectedTag(Scoreable.MDL,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        }
        if (sScore.compareTo("ENTROPY") == 0) {
            setScoreType(new SelectedTag(Scoreable.ENTROPY,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        }
        if (sScore.compareTo("AIC") == 0) {
            setScoreType(new SelectedTag(Scoreable.AIC,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
        }

        Utils.checkForRemainingOptions(options);
    } // setOptions

    /**
     * Gets the current settings of the classifier.
     *
     * @return an array of strings suitable for passing to setOptions
     */
    public String[] getOptions() {
        Vector<String> options = new Vector<String>();

        // alpha value
        options.add("-A");
        options.add("" + m_fAlpha);

        // display index
        options.add("-C");
        options.add("" + m_cDisplay);

        // scoring scheme
        options.add("-S");
        switch (m_nScoreType) {

            case (Scoreable.BAYES):
                options.add("BAYES");
                break;

            case (Scoreable.BDeu):
                options.add("BDeu");
                break;

            case (Scoreable.MDL):
                options.add("MDL");
                break;

            case (Scoreable.ENTROPY):
                options.add("ENTROPY");

                break;

            case (Scoreable.AIC):
                options.add("AIC");
                break;
        }

        return options.toArray(new String[options.size()]);
    } // getOptions

    /**
     * Returns default capabilities of the classifier.
     *
     * @return the capabilities of this classifier
     */
    public Capabilities getCapabilities() {
        Capabilities result = super.getCapabilities();
        result.disableAll();

        // attributes
        result.enable(Capability.NOMINAL_ATTRIBUTES);
        result.enable(Capability.NUMERIC_ATTRIBUTES);
        result.enable(Capability.MISSING_VALUES);

        // class
        result.enable(Capability.NOMINAL_CLASS);
        result.enable(Capability.MISSING_CLASS_VALUES);

        // instances
        result.setMinimumNumberInstances(0);

        return result;
    } // getCapabilities

    /**
     * Generates the classifier.
     *
     * @param instances
     *            set of instances serving as training data
     * @throws Exception
     *             if the classifier has not been generated successfully
     */
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
//		m_Instances = new Instances(instances);
        m_Instances = instances;

        // initialize arrays
        int numClasses = m_Instances.classAttribute().numValues();
        m_Structures = new BayesNet[numClasses];
        m_cInstances = new Instances[numClasses];
        initializeEstimators(numClasses);

        for (int iClass = 0; iClass < numClasses; iClass++) {
            // filter all instances with a particular class label
            RemoveWithValues rmvFilter = new RemoveWithValues();
            rmvFilter.setAttributeIndex("" + (m_Instances.classIndex() + 1));
            rmvFilter.setInvertSelection(true);
            rmvFilter.setNominalIndicesArr(new int[]{iClass});
            rmvFilter.setInputFormat(m_Instances);
//			m_cInstances[iClass] = new Instances(m_Instances);
//			m_cInstances[iClass] = Filter.useFilter(m_cInstances[iClass],
//					rmvFilter);
            m_cInstances[iClass] = Filter.useFilter(m_Instances, rmvFilter);

            // generate tree structure for this class label, based on Chow and
            // Liu's greedy search
            MultiNetTAN tan = new MultiNetTAN();
            tan.setScoreType(new SelectedTag(m_nScoreType,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
//            m_Estimators[iClass] = new MultiNetSimpleEstimator();
            m_Structures[iClass] = new BayesNet();

//            m_Estimators[iClass].setAlpha(m_fAlpha);
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
    }

    protected void initializeEstimators(int numClasses) {
        m_Estimators = new MultinetSimpleEstimator[numClasses];
        for (int iClass = 0; iClass < numClasses; ++iClass) {
            m_Estimators[iClass] = new MultinetSimpleEstimator();
            m_Estimators[iClass].setAlpha(m_fAlpha);
        }
    }

    /**
     * Returns a description of the classifier. For the multinet TAN classifier,
     * this returns a list of structures prefaced by the corresponding class
     * labels.
     *
     * @return a description of the classifier as a string.
     */
    public String toString() {
        StringBuffer text = new StringBuffer();
        for (int iClass = 0; iClass < m_Instances.classAttribute().numValues(); iClass++) {
            text.append("=== Structure for class \'"
                    + m_Instances.classAttribute().value(iClass) + "\' ===\n");
            text.append(m_Structures[iClass].toString());
            text.append("\n");
        }

        text.append("=== Overall Scores ===\n");
        text.append("LogScore Bayes: " + measureBayesScore() + "\n");
        text.append("LogScore BDeu: " + measureBDeuScore() + "\n");
        text.append("LogScore MDL: " + measureMDLScore() + "\n");
        text.append("LogScore ENTROPY: " + measureEntropyScore() + "\n");
        text.append("LogScore AIC: " + measureAICScore() + "\n");

        return text.toString();
    }

    /**
     * Calculates the class membership probabilities for the given test
     * instance.
     *
     * @param instance
     *            the instance to be classified
     * @return predicted class probability distribution
     * @throws Exception
     *             if there is a problem generating the prediction
     */
    public double[] distributionForInstance(Instance instance) throws Exception {
        instance = normalizeInstance(instance);

        int numClasses = m_Instances.numClasses(); // number of class labels
        double[] fProbs = new double[numClasses]; // posterior probability of
        // each class
        double[] logfProbs = new double[numClasses]; // log of corresponding
        // values in fProb
        for (int iClass = 0; iClass < instance.numClasses(); iClass++) {
//            logfProbs[iClass] = Math.log(m_Estimators[iClass].distributionForInstance(
//                    m_Structures[iClass], instance)[0])
//                    + Math.log(m_cEstimator.distributionForInstance(instance)[iClass]);
            logfProbs[iClass] = m_Estimators[iClass].logDist(m_Structures[iClass], instance)
                    + Math.log(m_cEstimator.distributionForInstance(instance)[iClass]);
        }

        // Find maximum probability (to facilitate normalization)
        double logfMax = logfProbs[0];
        for (int iClass = 0; iClass < numClasses; iClass++) {
            if (logfProbs[iClass] > logfMax) {
                logfMax = logfProbs[iClass];
            }
        }

        // transform from log-space to normal-space
        for (int iClass = 0; iClass < numClasses; iClass++) {
            fProbs[iClass] = Math.exp(logfProbs[iClass] - logfMax);
        }

        Utils.normalize(fProbs);

        return fProbs;
    } // distributionForInstance

    /**
     * Main method for testing this class.
     *
     * @param argv
     *            the options
     */
    public static void main(String[] argv) {
        runClassifier(new BayesMultiNetTAN(), argv);
    } // main

    /**
     * Ensure that all variables are nominal and that there are no missing
     * values
     *
     * @param instances
     *            data set to check and quantize and/or fill in missing values
     * @return filtered instances
     * @throws Exception
     *             if a filter (Discretize, ReplaceMissingValues) fails
     */
    protected Instances normalizeDataSet(Instances instances) throws Exception {
        m_DiscretizeFilter = null;
        m_MissingValuesFilter = null;

        boolean bHasNonNominal = false;
        boolean bHasMissingValues = false;

        Enumeration enu = instances.enumerateAttributes();
        while (enu.hasMoreElements()) {
            Attribute attribute = (Attribute) enu.nextElement();
            if (attribute.type() != Attribute.NOMINAL) {
                m_nNonDiscreteAttribute = attribute.index();
                bHasNonNominal = true;
                // throw new
                // UnsupportedAttributeTypeException("BayesNet handles nominal variables only. Non-nominal variable in dataset detected.");
            }
            Enumeration enum2 = instances.enumerateInstances();
            while (enum2.hasMoreElements()) {
                if (((Instance) enum2.nextElement()).isMissing(attribute)) {
                    bHasMissingValues = true;
                    // throw new
                    // NoSupportForMissingValuesException("BayesNet: no missing values, please.");
                }
            }
        }

        if (bHasNonNominal) {
            System.err.println("Warning: discretizing data set");
            m_DiscretizeFilter = new Discretize();
            m_DiscretizeFilter.setInputFormat(instances);
            instances = Filter.useFilter(instances, m_DiscretizeFilter);
        }

        if (bHasMissingValues) {
            System.err.println("Warning: filling in missing values in data set");
            m_MissingValuesFilter = new ReplaceMissingValues();
            m_MissingValuesFilter.setInputFormat(instances);
            instances = Filter.useFilter(instances, m_MissingValuesFilter);
        }
        return instances;
    } // normalizeDataSet

    /**
     * ensure that all variables are nominal and that there are no missing
     * values
     *
     * @param instance
     *            instance to check and quantize and/or fill in missing values
     * @return filtered instance
     * @throws Exception
     *             if a filter (Discretize, ReplaceMissingValues) fails
     */
    protected Instance normalizeInstance(Instance instance) throws Exception {
        if ((m_DiscretizeFilter != null)
                && (instance.attribute(m_nNonDiscreteAttribute).type() != Attribute.NOMINAL)) {
            m_DiscretizeFilter.input(instance);
            instance = m_DiscretizeFilter.output();
        }
        if (m_MissingValuesFilter != null) {
            m_MissingValuesFilter.input(instance);
            instance = m_MissingValuesFilter.output();
        } else {
            // is there a missing value in this instance?
            // this can happen when there is no missing value in the training
            // set
            for (int iAttribute = 0; iAttribute < m_Instances.numAttributes(); iAttribute++) {
                if (iAttribute != instance.classIndex()
                        && instance.isMissing(iAttribute)) {
                    System.err.println("Warning: Found missing value in test set, filling in values.");
                    m_MissingValuesFilter = new ReplaceMissingValues();
                    m_MissingValuesFilter.setInputFormat(m_Instances);
                    Filter.useFilter(m_Instances, m_MissingValuesFilter);
                    m_MissingValuesFilter.input(instance);
                    instance = m_MissingValuesFilter.output();
                    iAttribute = m_Instances.numAttributes();
                }
            }
        }
        return instance;
    } // normalizeInstance

    // implementation of AdditionalMeasureProducer interface
    /**
     * Returns an enumeration of the measure names. Additional measures must
     * follow the naming convention of starting with "measure", eg. double
     * measureBlah()
     *
     * @return an enumeration of the measure names
     */
    @Override
    public Enumeration enumerateMeasures() {
        Vector newVector = new Vector(4);
        newVector.addElement("measureBayesScore");
        newVector.addElement("measureBDeuScore");
        newVector.addElement("measureMDLScore");
        newVector.addElement("measureAICScore");
        newVector.addElement("measureEntropyScore");
        return newVector.elements();
    } // enumerateMeasures

    /**
     * Returns the value of the named measure
     *
     * @param measureName
     *            the name of the measure to query for its value
     * @return the value of the named measure
     * @throws IllegalArgumentException
     *             if the named measure is not supported
     */
    @Override
    public double getMeasure(String measureName) {
        if (measureName.equals("measureBayesScore")) {
            return measureBayesScore();
        }
        if (measureName.equals("measureBDeuScore")) {
            return measureBDeuScore();
        }
        if (measureName.equals("measureMDLScore")) {
            return measureMDLScore();
        }
        if (measureName.equals("measureAICScore")) {
            return measureAICScore();
        }
        if (measureName.equals("measureEntropyScore")) {
            return measureEntropyScore();
        }
        throw new IllegalArgumentException("Measure " + measureName
                + " does not exist for BayesMultiNetTAN.java");
    } // getMeasure

    public double measureBayesScore() {
        double result = m_cEstimator.measureBayesScore();
        for (int iClass = 0; iClass < m_Structures.length; iClass++) {
            result += m_Structures[iClass].measureBayesScore();
        }
        return result;
    } // measureBayesScore

    public double measureBDeuScore() {
        double result = m_cEstimator.measureBDeuScore();
        for (int iClass = 0; iClass < m_Structures.length; iClass++) {
            result += m_Structures[iClass].measureBDeuScore();
        }
        return result;
    } // measureBDeuScore

    public double measureMDLScore() {
        double result = m_cEstimator.measureMDLScore();
        for (int iClass = 0; iClass < m_Structures.length; iClass++) {
            result += m_Structures[iClass].measureMDLScore();
        }
        return result;
    } // measureMDLScore

    public double measureAICScore() {
        double result = m_cEstimator.measureAICScore();
        for (int iClass = 0; iClass < m_Structures.length; iClass++) {
            result += m_Structures[iClass].measureAICScore();
        }
        return result;
    } // measureAICScore

    public double measureEntropyScore() {
        double result = m_cEstimator.measureEntropyScore();
        for (int iClass = 0; iClass < m_Structures.length; iClass++) {
            result += m_Structures[iClass].measureEntropyScore();
        }
        return result;
    } // measureEntropyScore

    /**
     * Returns the type of graph this classifier represents.
     *
     * @return Drawable.BayesNet
     */
    @Override
    public int graphType() {
        return Drawable.BayesNet;
    }

    /**
     * Returns a graph representation of this classifier. This method outputs
     * the structure associated with the class label given by the
     * <code>-C</code> option.
     *
     * @return a String representing the graph in XML BIF 0.3 format.
     */
    @Override
    public String graph() throws Exception {
        return m_Structures[m_cDisplay].graph();
    }

    /**
     * Sets the alpha value (weight of prior probability).
     *
     * @param alpha
     *            the alpha value
     */
    public void setAlpha(double alpha) {
        m_fAlpha = alpha;
    }

    /**
     * Returns the alpha value (weight of prior probability).
     *
     * @return the alpha value
     */
    public double getAlpha() {
        return m_fAlpha;
    }

    /**
     * Returns a String to describe the <code>-A</code> option.
     *
     * @return the aforementioned String.
     */
    public String alphaTipText() {
        return "Initial count (alpha), defaults to 0.5.";
    }

    /**
     * Sets the index of the class label whose structure should be displayed in
     * the Weka GUI.
     *
     * @param cDisplay
     *            the index of the class label to be displayed
     */
    public void setDisplayIndex(int cDisplay) {
        m_cDisplay = cDisplay;
    }

    /**
     * Returns the index of the class label whose structure should be displayed
     * in the Weka GUI.
     *
     * @return the index of the class label to be displayed
     */
    public int getDisplayIndex() {
        return m_cDisplay;
    }

    /**
     * Returns a String to describe the <code>-C</code> option.
     *
     * @return the aforementioned String.
     */
    public String displayIndexTipText() {
        return "Choose class label index whose structure is displayed graphically (defaults to first).";
    }

    /**
     * set quality measure to be used in searching for networks.
     *
     * @param newScoreType
     *            the new score type
     */
    public void setScoreType(SelectedTag newScoreType) {
        if (newScoreType.getTags() == LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE) {
            m_nScoreType = newScoreType.getSelectedTag().getID();
        }
    }

    /**
     * get quality measure to be used in searching for networks.
     *
     * @return quality measure
     */
    public SelectedTag getScoreType() {
        return new SelectedTag(m_nScoreType,
                LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE);
    }

    /**
     * @return a string to describe the ScoreType option.
     */
    public String scoreTypeTipText() {
        return "The score type determines the measure used to judge the quality of a"
                + " network structure. It can be one of Bayes, BDeu, Minimum Description Length (MDL),"
                + " Akaike Information Criterion (AIC), and Entropy.";
    }

    /**
     * Extension of {@link SimpleEstimator} which can handle the multinet
     * approach of BayesMultiNetTAN.
     */
//    class MultiNetSimpleEstimator extends SimpleEstimator {
//
//        /** for serialization */
//        static final long serialVersionUID = 5874941612331806172L;
//
//        /**
//         * Returns a string describing this object
//         *
//         * @return a description of the classifier suitable for displaying in
//         *         the explorer/experimenter gui
//         */
//        public String globalInfo() {
//            return "MultiNetSimpleEstimator is used for estimating the "
//                    + "conditional probability tables of a multinet Bayes "
//                    + "network once the structure has been learned. Estimates "
//                    + "probabilities directly from data.";
//        }
//
//        /**
//         * Calculates the class membership probabilities for the given test
//         * instance. For this particular implementation, a single probability is
//         * returned, since the MultiNetSimpleEstimator is associated with a
//         * single class label.
//         *
//         * @param bayesNet
//         *            the bayes net to use
//         * @param instance
//         *            the instance to be classified
//         * @return predicted class probability distribution
//         * @throws Exception
//         *             if there is a problem generating the prediction
//         */
//        public double[] distributionForInstance(BayesNet bayesNet,
//                Instance instance) throws Exception {
//
//            double logfP = logDist(bayesNet, instance);
//
//            return new double[]{Math.exp(logfP)};
//        }
//
//        private double logDist(BayesNet bayesNet, Instance instance) {
//            double logfP = 0;
//            Instances instances = bayesNet.m_Instances;
//            for (int iAttribute = 0; iAttribute < instances.numAttributes(); iAttribute++) {
//                if (iAttribute == instances.classIndex()) {
//                    // ignore class index, since this estimator is associated
//                    // with a single class label
//                    continue;
//                }
//                double iCPT = 0;
//
//                for (int iParent = 0; iParent < bayesNet.getParentSet(
//                        iAttribute).getNrOfParents(); iParent++) {
//                    int nParent = bayesNet.getParentSet(iAttribute).getParent(
//                            iParent);
//
//                    iCPT = iCPT * instances.attribute(nParent).numValues()
//                            + instance.value(nParent);
//                }
//
//                logfP += Math.log(bayesNet.m_Distributions[iAttribute][(int) iCPT].getProbability(instance.value(iAttribute)));
//            }
//            return logfP;
//        }
//    } // MultiNetSimpleEstimator

    /**
     * Extension of {@link TAN} which can handle the multinet approach of
     * BayesMultiNetTAN. This is necessary because the provided TAN
     * implementation automatically links the class node to every other node.
     */
    class MultiNetTAN extends TAN {

        /**
         * Version ID for serializing.
         */
        private static final long serialVersionUID = 4564324016106373420L;

        /**
         * buildStructure determines the network structure/graph of the network
         * using the maximimum weight spanning tree algorithm of Chow and Liu
         *
         * @param bayesNet
         *            the network
         * @param instances
         *            the data to use
         * @throws Exception
         *             if something goes wrong
         */
        public void buildStructure(BayesNet bayesNet, Instances instances)
                throws Exception {
            super.buildStructure(bayesNet, instances);

            // remove class attribute from every parent set
            for (int i = 0; i < instances.numAttributes(); i++) {
                if (i != instances.classIndex()) {
                    bayesNet.getParentSet(i).deleteParent(
                            instances.classIndex(), instances);
                }
            }
        }
    }
}