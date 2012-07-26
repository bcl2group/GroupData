package JH;

import java.text.DecimalFormat;

public class DirEdge implements Comparable<DirEdge> {
	public static final DecimalFormat form = new DecimalFormat("#.#####");
	
	double va, vb;
	
	public DirEdge() {
		va = 0;
		vb = 0;
	}
	
	public DirEdge(DirEdge e) {
		va = e.va;
		vb = e.vb;
	}
	
	public DirEdge(double _va, double _vb) {
		va = _va;
		vb = _vb;
	}
	
	public DirEdge add(DirEdge oth) {
		return new DirEdge(va + oth.va, vb + oth.vb);
	}
	
	public DirEdge adda(double a) {
		return new DirEdge(va + a, vb);
	}
	
	public DirEdge addb(double b) {
		return new DirEdge(va, vb + b);
	}
	
	public DirEdge swap() {
		return new DirEdge(vb, va);
	}
	
	public double sum() {
		return va + vb;
	}
	
	public double prop() {
		return va / sum();
	}
	
	public String toString() {
		return form.format(sum()) + " " + form.format(prop());
	}

	public int compareTo(DirEdge oth) {
		double a = sum();
		double b = oth.sum();
		if (a != b) return a < b ? -1 : 1;
		return 0;
	}
}