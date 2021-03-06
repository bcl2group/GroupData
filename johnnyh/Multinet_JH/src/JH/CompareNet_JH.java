package JH;
import java.io.*;
import java.util.*;

public class CompareNet_JH {

	public static final String fileListName = "_complist.txt";
	public static final String outName = "_compout.txt";
	public static final double thresh = 0.001;
	
	public static HashMap<String, Counter> ans = null;
	public static HashMap<String, Counter> cur = null;
	
	public static void main(String[] args) throws Exception {
		BufferedReader reader = new BufferedReader(new FileReader(fileListName));
		String s;
		while (true) {
			s = reader.readLine();
			if (s == null) break;
			s = s.trim();
			if (s.isEmpty()) continue;
			if (s.charAt(0) == '/') continue;
			String[] strs = s.split("[-]");
			cur = null;
			go(strs[0].trim());
			System.out.println(strs[0].trim() + " " + cur.size());
			if (ans == null) {
				ans = cur;
			} else {
				merge(ans, cur);
			}
			if (strs.length > 1) { // subtract second
				go(strs[1].trim());
				String pref = strs[0].trim().split("[.]")[0];
				System.out.println(pref + "_diff.txt" + " " + cur.size());
				FileWriter out = new FileWriter(pref + "_diff.txt");
				write(out, cur);
				out.close();
			}
		}
		FileWriter out = new FileWriter(outName);
		write(out, ans);
		out.close();
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
		if (cur == null) {
			cur = hm;
		} else {
			sub(cur, hm);
		}
	}
	public static void write(FileWriter out, HashMap<String, Counter> hm) throws Exception {
		TreeMap<Counter, ArrayList<String> > sorted = new TreeMap<Counter, ArrayList<String> >();
		for (Map.Entry<String, Counter> e : hm.entrySet()) {
			Counter k = e.getValue();
			if (sorted.get(k) == null) sorted.put(k, new ArrayList<String>());
			sorted.get(e.getValue()).add(e.getKey());
		}
		for (Map.Entry<Counter, ArrayList<String> > e : sorted.entrySet()) {
			if (Math.abs(e.getKey().comb.sum()) < thresh) continue;
			for (String v : e.getValue()) {
				Counter c = new Counter(e.getKey());
				if (c.comb.prop() >= 0.5) {
					out.write(v + " " + e.getKey());
				} else {
					c.comb = c.comb.swap();
					String[] rearr = v.split("[ ]");
					out.write(rearr[1] + " " + rearr[0] + " " + c);
				}
				out.write("\n");
			}
		}
	}
	public static void merge(HashMap<String, Counter> res, HashMap<String, Counter> a) {
		for (Map.Entry<String, Counter> e : a.entrySet()) {
			String k = e.getKey();
			if (res.get(k) == null) {
				res.put(k, e.getValue());
			} else {
				res.get(k).merge(e.getValue());
			}
		}
	}
	public static void sub(HashMap<String, Counter> res, HashMap<String, Counter> a) {
		for (Map.Entry<String, Counter> e : a.entrySet()) {
			String k = e.getKey();
			if (res.get(k) == null) continue;
			res.get(k).sub(e.getValue());
		}
	}
}
