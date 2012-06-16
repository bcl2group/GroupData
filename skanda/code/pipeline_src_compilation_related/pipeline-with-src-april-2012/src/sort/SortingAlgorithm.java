package sort;

public interface SortingAlgorithm<T extends Comparable<T>> {
	public void run(SortedList<T> list);
}
