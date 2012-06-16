package sort;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;

import org.junit.Test;

public class MergeSortTest {

	@Test
	public void testRun() {
		List<Double> list = new LinkedList<Double>();
		list.add(1.0);
		list.add(3.0);
		list.add(0.0);
		list.add(1.0);
		list.add(5.0);
		list.add(4.0);
		list.add(1.0);
		
		MergeSort<Double> algo = new MergeSort<Double>();
		SortedList<Double> result = algo.run(list);
		System.out.println(result);
	}

}
