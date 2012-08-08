package JH;
import java.io.*;
import java.util.*;

public class Regress_JH {

	public static final String fileListName = "_rlist.txt";
	public static final String outName = "_rout.txt";
	public static final double thresh = 0;

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
			String pref = strs[0].trim().split("[.]")[0];
			System.out.println(pref + " " + cur.size());
			String oth = pref + "_w.txt";
			go(oth);
			FileWriter out = new FileWriter(pref + "_r.txt");
			write(out, cur);
			out.close();
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
		if (cur == null) {
			cur = hm;
		} else {
			div(cur, hm);
			cur = hm;
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
				if (e.getKey().comb.prop() >= 0.5) {
					out.write(v + " " + e.getKey());
				} else {
					e.getKey().comb = e.getKey().comb.swap();
					String[] rearr = v.split("[ ]");
					out.write(rearr[1] + " " + rearr[0] + " " + e.getKey());
				}
				out.write("\n");
			}
		}
	}
	public static void div(HashMap<String, Counter> res, HashMap<String, Counter> a) {
		for (Map.Entry<String, Counter> e : res.entrySet()) {
			String k = e.getKey();
			if (a.get(k) == null) continue;
			Counter v = e.getValue();
			a.get(k).num = (int)Math.round(v.comb.sum());
		}
	}
}
