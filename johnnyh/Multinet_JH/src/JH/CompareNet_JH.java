package JH;
import java.io.*;
import java.util.*;
public class CompareNet_JH {

	public static final String fileListName = "_complist.txt";
	public static final String outName = "_compout.txt";
	
	public static HashMap<String, Counter> ans = null;
	
	public static void main(String[] args) throws Exception {
		BufferedReader reader = new BufferedReader(new FileReader(fileListName));
		PrintStream out = new PrintStream(new FileOutputStream(outName));
		
		String s;
		while (true) {
			s = reader.readLine();
			if (s == null) break;
			s = s.trim();
			if (s.isEmpty()) break;
			go(s);
		}
		TreeMap<Counter, ArrayList<String> > sorted = new TreeMap<Counter, ArrayList<String> >();
		for (Map.Entry<String, Counter> e : ans.entrySet()) {
			Counter k = e.getValue();
			if (sorted.get(k) == null) sorted.put(k, new ArrayList<String>());
			sorted.get(e.getValue()).add(e.getKey());
		}
		for (Map.Entry<Counter, ArrayList<String> > e : sorted.entrySet()) {
			for (String v : e.getValue()) {
				if (e.getKey().comb.prop() >= 0.5) {
					out.println(v + " " + e.getKey());
				} else {
					e.getKey().comb = e.getKey().comb.swap();
					String[] rearr = v.split("[ ]");
					out.println(rearr[1] + " " + rearr[0] + " " + e.getKey());
				}
			}
		}
	}
	public static void go(String name) throws Exception {
		BufferedReader br = new BufferedReader(new FileReader(name));
		HashMap<String, Counter> hm = new HashMap<String, Counter>();
		String s;
		while (true) {
			s = br.readLine();
			if (s == null) break;
			s = s.trim();
			if (s.isEmpty()) break;
			if (s.equals("Bayes Network Classifier")) break;
			String[] strs = s.split("[ ]");
			String a = strs[0];
			String b = strs[1];
			double val = Double.parseDouble(strs[2]);
			double prop = Double.parseDouble(strs[3]);
			DirEdge e = new DirEdge(val * prop, val * (1 - prop));
			String pref;
			if (a.compareTo(b) < 0) {
				pref = a + " " + b;
			} else {
				pref = b + " " + a;
				e = e.swap();
			}
			hm.put(pref, new Counter(1, e));
		}
		if (ans == null) {
			ans = hm;
		} else {
				merge(ans, hm);
		}
	}
	public static void merge(HashMap<String, Counter> res, HashMap<String, Counter> a) {
		for (Map.Entry<String, Counter> e : a.entrySet()) {
			String k = e.getKey();
			if (res.get(k) == null) {
				res.put(k, e.getValue());
			} else {
				res.get(k).add(e.getValue());
			}
		}
	}
}

class Counter implements Comparable<Counter> {
	int num;
	DirEdge comb;
	Counter(int _num, DirEdge _comb) {
		num = _num;
		comb = new DirEdge(_comb);
	}
	void add(Counter oth) {
		num += oth.num;
		comb = comb.add(oth.comb);
	}
	public int compareTo(Counter oth) {
		if (num != oth.num) return num < oth.num ? -1 : 1;
		return comb.compareTo(oth.comb);
	}
	public String toString() {
		return num + " " + comb;
	}
}