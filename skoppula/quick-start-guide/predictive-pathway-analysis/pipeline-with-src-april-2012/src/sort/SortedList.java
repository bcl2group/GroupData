package sort;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public class SortedList<T extends Comparable<T>> {
//	List<T> original;
	List<T> sorted;
	List<Integer> originalIndices;
	
	private SortedList(SortedList<T> list, int start, int end) {
//		original = list.original.subList(start, end);
		sorted = new ArrayList<T>(list.sorted.subList(start, end));
		originalIndices = new ArrayList<Integer>(list.originalIndices.subList(start, end));
	}
	
	public SortedList() {
		clear();
	}
	
	void clear() {
		sorted = new ArrayList<T>();
		originalIndices = new ArrayList<Integer>();
	}

	public SortedList(List<T> original, SortingAlgorithm<T> algorithm) {
//		this.original = original;
		sorted = original;
		originalIndices = new ArrayList<Integer>();
		
		for (int i = 0; i < original.size(); i++) {
			originalIndices.add(i);
		}
		algorithm.run(this);
	}
	
	public SortedList(List<T> original) {
		this(original, new MergeSort<T>());
	}
	
	public int size() {
//		return original.size();
		return sorted.size();
	}
	
	public boolean isEmpty() {
//		return original.isEmpty();
		return sorted.isEmpty();
	}
	
	public SortedList<T> subList(int start, int end) {
		return new SortedList<T>(this, start, end);
	}
	
	public Iterator<T> eltIterator() {
		return sorted.iterator();
	}
	
	public Iterator<Integer> indIterator() {
		return originalIndices.iterator();
	}
	
	void add(T nextElt, int nextIndex) {
		sorted.add(nextElt);
		originalIndices.add(nextIndex);
	}
	
	public String toString() {
		String result = "{";
		Iterator<T> elts = eltIterator();
		Iterator<Integer> inds = indIterator();
		while (elts.hasNext()) {
			result += elts.next().toString() + "=" + inds.next();
			if (elts.hasNext()) {
				result += ", ";
			}
		}
		return result + "}";
	}
}
