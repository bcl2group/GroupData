package JH;

public class Counter implements Comparable<Counter> {
	int num;
	DirEdge comb;
	Counter(int _num, DirEdge _comb) {
		num = _num;
		comb = new DirEdge(_comb);
	}
	Counter(Counter oth) {
		num = oth.num;
		comb = new DirEdge(oth.comb);
	}
	void merge(Counter oth) {
		num += oth.num;
		comb = comb.merge(oth.comb);
	}
	void sub(Counter oth) {
		comb = comb.sub(oth.comb);
	}
	public int compareTo(Counter oth) {
		if (num != oth.num) return num < oth.num ? 1 : -1;
		return comb.compareTo(oth.comb);
	}
	public String toString() {
		return comb + " " + num;
	}
}