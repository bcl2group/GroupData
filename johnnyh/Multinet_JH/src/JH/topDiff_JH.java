package JH;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

import weka.core.*;
import weka.filters.Filter;
import weka.filters.unsupervised.attribute.Remove;

public class topDiff_JH {
//	public static final String fname = "all_100percent.txt";
//	public static final int filtern = 4000;
//	public static void main(String[] args) throws Exception {
//		BufferedReader reader = new BufferedReader(new FileReader(fname));
//		Instances data = new Instances(reader);
//		reader.close();
//		data.setClassIndex(0);
//		Filter f = runTopDiff(data, filtern);
//		Instances newData = Filter.useFilter(data, f);
//	}
	
	public static Filter runTopDiff(Instances data, int topn) throws Exception {
		System.out.println("***Finding top genes***");
		HashSet<Integer> tot = null;
		int numClass = data.numClasses();
		for (int i = 0; i < numClass; i++) {
			String name = data.classAttribute().value(i);
			if (name.startsWith("Control")) continue;
			
//			System.out.println("\n***Processing experiment " + name + "***");
			HashSet<Integer> ret = getTopDiff(data, name, topn);
			if (tot == null) {
				tot = ret;
			} else {
				tot = inter(tot, ret);
			}
		}
		System.out.println(tot.size() + " common genes found");
		int[] arr = toArray(tot);
		ArrayList<String> arrNames = new ArrayList<String>();
		for (int a : arr) {
			arrNames.add(data.attribute(a).name());
		}
		Collections.sort(arrNames);
		for (String s : arrNames) {
			System.out.print(s + " ");
		}
		System.out.println();
		return getFilter(data, arr);
	}
	
	public static Filter getFilter(Instances data, int[] inds) throws Exception {
		Remove rem = new Remove();
		rem.setAttributeIndicesArray(inds);
		rem.setInvertSelection(true);
		rem.setInputFormat(data);
		return rem;
	}
	
	public static int[] toArray(HashSet<Integer> set) {
		ArrayList<Integer> list = new ArrayList<Integer>(set);
		Collections.shuffle(list);
		int[] arr = new int[set.size() + 1];
		int pos = 0;
		arr[pos++] = 0; // add class
		for (int a : list) {
			arr[pos++] = a;
		}
		return arr;
	}
	
	public static HashSet<Integer> inter(HashSet<Integer> a, HashSet<Integer> b) {
		HashSet<Integer> res = new HashSet<Integer>();
		for (Integer s : a) {
			if (b.contains(s)) {
				res.add(s);
			}
		}
		return res;
	}
	
	public static HashSet<Integer> getTopDiff(Instances data, String targ, int n) {
		int[] ret = getTopDiff(data, targ);
		HashSet<Integer> res = new HashSet<Integer>();
		for (int s : ret) {
			res.add(s);
			if (res.size() == n) break;
		}
		return res;
	}
	

	
	// return indices of top differentiated genes in decreasing order
	public static int[] getTopDiff(Instances data, String targ) {
		int n = data.numInstances();
		int m = data.numAttributes();
		
		ArrayList<Double>[][] vals = new ArrayList[2][m];
		for (int i = 0; i < 2; i++)
			for (int j = 0; j < m; j++)
				vals[i][j] = new ArrayList<Double>();
		
		for (int i = 0; i < n; i++) {
			Instance cur = data.instance(i);
			String cc = cur.toString(0);
			int ind = -1;
			if (cc.equals("Control_" + targ)) {
				ind = 0;
			} else if (cc.equals(targ)) {
				ind = 1;
			}
			if (ind == -1) continue;
			for (int j = 1; j < m; j++) {
				double val = cur.value(j);
				vals[ind][j].add(val);
			}
		}
		
		double[] diffList = new double[m];
		double[] meanList = new double[m];
		for (int i = 1; i < m; i++) {
			double am = Util.mean(vals[0][i]);
			double bm = Util.mean(vals[1][i]);
			diffList[i] = Math.abs(am - bm);
			meanList[i] = (am + bm) / 2;
		}
		double minMean = Util.getMin(meanList);
		double maxMean = Util.getMax(meanList);
		double range = maxMean - minMean;
		
		TreeMap<Double, Vector<Integer> > sorted = new TreeMap<Double, Vector<Integer> >();
		for (int i = 1; i < m; i++) {
			double stat = diffList[i] * (meanList[i] - minMean) / range;
			if (sorted.get(stat) == null) {
				sorted.put(stat, new Vector<Integer>());
			}
			sorted.get(stat).add(i);
		}
		int[] res = new int[m - 1];
		int pos = 0;
		for (Double e : sorted.descendingKeySet()) {
			for (int ind : sorted.get(e)) {
				res[pos++] = ind;
//				if (pos < 100) System.out.println(e + " " + data.attribute(ind).name());
			}
		}
		return res;
	}
}
