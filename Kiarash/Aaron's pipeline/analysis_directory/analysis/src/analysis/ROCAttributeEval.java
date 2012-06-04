/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package analysis;

/**
 *
 * @author Aaron
 */
import weka.core.Capabilities;
import weka.core.ContingencyTables;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.Option;
import weka.core.OptionHandler;
import weka.core.RevisionUtils;
import weka.core.Utils;
import weka.core.Capabilities.Capability;
import weka.filters.Filter;
import weka.filters.supervised.attribute.Discretize;
import weka.filters.unsupervised.attribute.NumericToBinary;

import java.util.Enumeration;
import java.util.Random;
import java.util.Vector;
import weka.attributeSelection.ASEvaluation;
import weka.attributeSelection.AttributeEvaluator;
import weka.classifiers.Classifier;
import weka.classifiers.Evaluation;
import weka.classifiers.bayes.BayesNet;
import weka.classifiers.bayes.net.estimate.SimpleEstimator;
import weka.classifiers.bayes.net.search.global.K2;
import weka.estimators.Estimator;
import weka.filters.unsupervised.attribute.Remove;

/**
 *
 * @author Aaron
 */
public class ROCAttributeEval
  extends ASEvaluation
  implements AttributeEvaluator, OptionHandler {

  /** for serialization */
  static final long serialVersionUID = -8316857822521717692L;

  /** Treat missing values as a seperate value */
  private boolean m_missing_merge;

  /** Just binarize numeric attributes */
  private boolean m_Binarize;

  /** The chi-squared value for each attribute */
  private double[] m_ROCs;

  /**
   * Returns a string describing this attribute evaluator
   * @return a description of the evaluator suitable for
   * displaying in the explorer/experimenter gui
   */
  public String globalInfo() {
    return "ChiSquaredAttributeEval :\n\nEvaluates the worth of an attribute "
      +"by computing the value of the chi-squared statistic with respect to the class.\n";
  }

  /**
   * Constructor
   */
  public ROCAttributeEval () {
    resetOptions();
  }

  /**
   * Returns an enumeration describing the available options
   * @return an enumeration of all the available options
   **/
  public Enumeration listOptions () {
    Vector newVector = new Vector(2);
    newVector.addElement(new Option("\ttreat missing values as a seperate "
                                    + "value.", "M", 0, "-M"));
    newVector.addElement(new Option("\tjust binarize numeric attributes instead \n"
                                    +"\tof properly discretizing them.", "B", 0,
                                    "-B"));
    return  newVector.elements();
  }


  /**
   * Parses a given list of options. <p/>
   *
   <!-- options-start -->
   * Valid options are: <p/>
   *
   * <pre> -M
   *  treat missing values as a seperate value.</pre>
   *
   * <pre> -B
   *  just binarize numeric attributes instead
   *  of properly discretizing them.</pre>
   *
   <!-- options-end -->
   *
   * @param options the list of options as an array of strings
   * @throws Exception if an option is not supported
   */
  public void setOptions (String[] options)
    throws Exception {

    resetOptions();
    setMissingMerge(!(Utils.getFlag('M', options)));
    setBinarizeNumericAttributes(Utils.getFlag('B', options));
  }


  /**
   * Gets the current settings.
   *
   * @return an array of strings suitable for passing to setOptions()
   */
  public String[] getOptions () {
    String[] options = new String[2];
    int current = 0;

    if (!getMissingMerge()) {
      options[current++] = "-M";
    }
    if (getBinarizeNumericAttributes()) {
      options[current++] = "-B";
    }

    while (current < options.length) {
      options[current++] = "";
    }

    return  options;
  }

  /**
   * Returns the tip text for this property
   * @return tip text for this property suitable for
   * displaying in the explorer/experimenter gui
   */
  public String binarizeNumericAttributesTipText() {
    return "Just binarize numeric attributes instead of properly discretizing them.";
  }

  /**
   * Binarize numeric attributes.
   *
   * @param b true=binarize numeric attributes
   */
  public void setBinarizeNumericAttributes (boolean b) {
    m_Binarize = b;
  }


  /**
   * get whether numeric attributes are just being binarized.
   *
   * @return true if missing values are being distributed.
   */
  public boolean getBinarizeNumericAttributes () {
    return  m_Binarize;
  }

  /**
   * Returns the tip text for this property
   * @return tip text for this property suitable for
   * displaying in the explorer/experimenter gui
   */
  public String missingMergeTipText() {
    return "Distribute counts for missing values. Counts are distributed "
      +"across other values in proportion to their frequency. Otherwise, "
      +"missing is treated as a separate value.";
  }

  /**
   * distribute the counts for missing values across observed values
   *
   * @param b true=distribute missing values.
   */
  public void setMissingMerge (boolean b) {
    m_missing_merge = b;
  }


  /**
   * get whether missing values are being distributed or not
   *
   * @return true if missing values are being distributed.
   */
  public boolean getMissingMerge () {
    return  m_missing_merge;
  }

  /**
   * Returns the capabilities of this evaluator.
   *
   * @return            the capabilities of this evaluator
   * @see               Capabilities
   */
  public Capabilities getCapabilities() {
    Capabilities result = super.getCapabilities();
    result.disableAll();

    // attributes
    result.enable(Capability.NOMINAL_ATTRIBUTES);
    result.enable(Capability.NUMERIC_ATTRIBUTES);
//    result.enable(Capability.DATE_ATTRIBUTES);
    result.enable(Capability.MISSING_VALUES);

    // class
    result.enable(Capability.NOMINAL_CLASS);
    result.enable(Capability.MISSING_CLASS_VALUES);

    return result;
  }

  /**
   * Initializes a chi-squared attribute evaluator.
   * Discretizes all attributes that are numeric.
   *
   * @param data set of instances serving as training data
   * @throws Exception if the evaluator has not been
   * generated successfully
   */
  public void buildEvaluator (Instances data)
    throws Exception {

    // can evaluator handle data?
    getCapabilities().testWithFail(data);

    int classIndex = data.classIndex();
    int numInstances = data.numInstances();
    Random rnd = new Random(42);

    if (!m_Binarize) {
      Discretize disTransform = new Discretize();
      disTransform.setUseBetterEncoding(true);
      disTransform.setInputFormat(data);
      data = Filter.useFilter(data, disTransform);
    } else {
      NumericToBinary binTransform = new NumericToBinary();
      binTransform.setInputFormat(data);
      data = Filter.useFilter(data, binTransform);
    }
    int numClasses = data.attribute(classIndex).numValues();

    /// START LOOP - REMOVE ALL BUT ONE ATTRIBUTE + CLASS

    Remove rm = new Remove();
    rm.setInvertSelection(true);

    Instances setOf2;

    Classifier bn = new BayesNet();
    Classifier bnCopy;

    Evaluation ev;
    K2 xK2 = new K2();
    xK2.setInitAsNaiveBayes(true);
    xK2.setMaxNrOfParents(1);
    ((BayesNet) bn).setSearchAlgorithm(xK2);

    m_ROCs = new double[data.numAttributes()];

    for (int att_counter = 0; att_counter < data.numAttributes(); att_counter++){
        if (att_counter != classIndex){

            // Remove all attributes but the current attribute and the class variable
            rm.setAttributeIndicesArray(new int[] {att_counter,classIndex});
            rm.setInputFormat(data);
            setOf2 = rm.useFilter(data, rm);



            bnCopy = Classifier.makeCopy(bn);
            ev = new Evaluation(setOf2);
            ev.crossValidateModel(bnCopy, setOf2,Math.min(data.numInstances(),5),rnd);  //5 fold CV

            m_ROCs[att_counter] = ev.weightedAreaUnderROC();
            if (att_counter % 10 == 0){
                System.out.println("" + att_counter + " : " + ev.weightedAreaUnderROC());
            }
    }} /// END LOOP - RELOAD ALL ATTRIBUTES

  }

  /**
   * Reset options to their default values
   */
  protected void resetOptions () {
    m_ROCs = null;
    m_missing_merge = true;
    m_Binarize = false;
  }


  /**
   * evaluates an individual attribute by measuring its
   * chi-squared value.
   *
   * @param attribute the index of the attribute to be evaluated
   * @return the chi-squared value
   * @throws Exception if the attribute could not be evaluated
   */
  public double evaluateAttribute (int attribute)
    throws Exception {

    return m_ROCs[attribute];
  }

  /**
   * Describe the attribute evaluator
   * @return a description of the attribute evaluator as a string
   */
  public String toString () {
    StringBuffer text = new StringBuffer();

    if (m_ROCs == null) {
      text.append("Single Naive Bayes ROC attribute evaluator has not been built");
    }
    else {
      text.append("\tSingle Naive Bayes ROC Ranking Filter");
      if (!m_missing_merge) {
        text.append("\n\tMissing values treated as seperate");
      }
      if (m_Binarize) {
        text.append("\n\tNumeric attributes are just binarized");
      }
    }

    text.append("\n");
    return  text.toString();
  }

  /**
   * Returns the revision string.
   *
   * @return		the revision
   */
  public String getRevision() {
    return RevisionUtils.extract("$Revision: 5447 $");
  }

  /**
   * Main method.
   *
   * @param args the options
   */
  public static void main (String[] args) {
    runEvaluator(new ROCAttributeEval(), args);
  }
}
