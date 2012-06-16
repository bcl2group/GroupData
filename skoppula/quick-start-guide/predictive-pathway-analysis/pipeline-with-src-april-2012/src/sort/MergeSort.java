package sort;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class MergeSort<T extends Comparable<T>> implements SortingAlgorithm<T> {
	
	@Override
	public void run(SortedList<T> list) {
		SortedList<T> result = run(list, 0, list.size());
		list.clear();
		Iterator<T> elts = result.eltIterator();
		Iterator<Integer> inds = result.indIterator();
		while (elts.hasNext()) {
			list.add(elts.next(), inds.next());
		}
	}
	
	public SortedList<T> run(List<T> list) {
		SortedList<T> result = new SortedList<T>(list, this);
		return result;
	}

	private SortedList<T> run(SortedList<T> list, int start, int end) {
		int size = end - start;
		if (size == 0 || size == 1) {
			return list.subList(start, end);
		} else {
			SortedList<T> result1 = run(list, start, start + size / 2);
			SortedList<T> result2 = run(list, start + size / 2, end);
			SortedList<T> result = merge(result1, result2);
			return result;
		}
	}

	private SortedList<T> merge(SortedList<T> result1, SortedList<T> result2) {
		if (result1.isEmpty()) {
			return result2.subList(0, result2.size());
		} else if (result2.isEmpty()) {
			return result1.subList(0, result1.size());
		} else {
			SortedList<T> result = new SortedList<T>();
			
			Iterator<T> iter1Elt = result1.eltIterator();
			Iterator<T> iter2Elt = result2.eltIterator();
			Iterator<Integer> iter1Ind = result1.indIterator();
			Iterator<Integer> iter2Ind = result2.indIterator();
			
			T next1Elt = iter1Elt.next();
			T next2Elt = iter2Elt.next();
			Integer next1Ind = iter1Ind.next();
			Integer next2Ind = iter2Ind.next();
			while (next1Elt != null && next2Elt != null) {
				if (next1Elt.compareTo(next2Elt) <= 0) {
					result.add(next1Elt, next1Ind);
					if (iter1Elt.hasNext()) {
						next1Elt = iter1Elt.next();
						next1Ind = iter1Ind.next();
					} else {
						next1Elt = null;
					}
				} else {
					result.add(next2Elt, next2Ind);
					if (iter2Elt.hasNext()) {
						next2Elt = iter2Elt.next();
						next2Ind = iter2Ind.next();
					} else {
						next2Elt = null;
					}
				}
			}
			
			if (next1Elt == null) {
				result.add(next2Elt, next2Ind);
				while (iter2Elt.hasNext()) {
					result.add(iter2Elt.next(), iter2Ind.next());
				}
			} else {
				result.add(next1Elt, next1Ind);
				while (iter1Elt.hasNext()) {
					result.add(iter1Elt.next(), iter1Ind.next());
				}
			}

			return result;
		}
	}
}
