package JH;

import java.text.DecimalFormat;

public class DirEdge implements Comparable<DirEdge> {
	public static final DecimalFormat form = new DecimalFormat("#.000000");
	public static final DecimalFormat formperc = new DecimalFormat("#.0000");
	
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
	
	public double merge(double a, double b) {
		return Math.min(a, b);
	}
	
	public DirEdge merge(DirEdge oth) {
		return new DirEdge(merge(va, oth.va), merge(vb, oth.vb));
	}
	
	public DirEdge sub(DirEdge oth) {
		return new DirEdge(Math.max(0, va - oth.va), Math.max(0, vb - oth.vb));
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
		return form.format(sum()) + " " + formperc.format(prop());
	}

	public int compareTo(DirEdge oth) {
		double a = sum();
		double b = oth.sum();
		if (a != b) return a < b ? 1 : -1;
		return 0;
	}
}