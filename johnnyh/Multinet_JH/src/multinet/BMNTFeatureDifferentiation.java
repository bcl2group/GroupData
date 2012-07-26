/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package multinet;

import weka.core.Instances;
import weka.core.Instance;
import java.util.ArrayList;
import java.util.HashMap;
import weka.classifiers.bayes.net.EditableBayesNet;
import weka.classifiers.bayes.net.search.local.LocalScoreSearchAlgorithm;
import weka.core.SelectedTag;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;
import weka.filters.unsupervised.instance.RemoveWithValues;
import weka.core.Attribute;

/**
 *
 * @author Teslin
 */
public class BMNTFeatureDifferentiation extends BMNTCaseControl {
    HashMap<String, ArrayList<String>> features; 

    
    public BMNTFeatureDifferentiation(HashMap<String, ArrayList<String>> features){
        this.features = features; 
    }
    
    @Override
    public void splitInstances(int iClass) throws Exception{
            int numClasses = m_Instances.classAttribute().numValues();
            initializeEstimators(numClasses);
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

            //maintain only selected features for each class
            Remove featFilter = new Remove(); 
            ArrayList<String> iFeats = features.get(m_Instances.classAttribute().
                    value(iClass));
            int[] indices = new int[iFeats.size() + 1];
            indices[0] = m_Instances.classIndex();
            for (int i = 0; i < iFeats.size(); i++){
                indices[i + 1] = m_Instances.attribute(iFeats.get(i)).index();
            }
            featFilter.setAttributeIndicesArray(indices);
            featFilter.setInvertSelection(true);
            featFilter.setInputFormat(m_cInstances[iClass]);
            m_cInstances[iClass] = Filter.useFilter(m_cInstances[iClass], 
                    featFilter); 
            m_cInstances[iClass].setClassIndex(m_Instances.classIndex());
            
            // generate tree structure for this class label, based on Chow and
            // Liu's greedy search
            MultiNet tan = new MultiNet();
            tan.setScoreType(new SelectedTag(m_nScoreType,
                    LocalScoreSearchAlgorithm.TAGS_SCORE_TYPE));
            m_Structures[iClass] = new EditableBayesNet();

            m_Estimators[iClass].setAlpha(m_fAlpha);
            ((EditableBayesNet) m_Structures[iClass]).setSearchAlgorithm(tan);
            ((EditableBayesNet) m_Structures[iClass]).setEstimator(m_Estimators[iClass]);
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
    
    
}