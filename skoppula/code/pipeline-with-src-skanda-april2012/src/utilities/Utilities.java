package utilities;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Random;

public final class Utilities {
	public static int[] randomSubset(int upper, int size, Random random) {
		int[] a = new int[upper];
		for (int i = 0; i < upper; i++) {
			a[i] = i;
		}
		return randomSubset(a, size, random);
	}
	
	public static int[] randomSubset(int [] a, int size, Random random) {
		int[] result = new int[size];

		for (int i = a.length - 1; i > 0; i--) {
			int j = random.nextInt(i + 1);
			int temp = a[j];
			a[j] = a[i];
			a[i] = temp;
		}

		for (int i = 0; i < size; i++) {
			result[i] = a[i];
		}
		return result;
	}

	public static String colToString(Collection<?> c, String delim) {
		String result = "";
		Iterator<?> iter = c.iterator();
		while (iter.hasNext()) {
			result += iter.next().toString();
			if (iter.hasNext()) {
				result += delim;
			}
		}
		return result;
	}

	public static String colToString(Collection<?> c) {
		return colToString(c, ",");
	}

	public static int numExceeding(double[] array, double bound, boolean isSorted) {
		if (isSorted) {
			return array.length - binarySearch(array, 0, array.length - 1, bound) - 1;
		} else {
			int result = 0;
			for (double d : array) {
				result += d > bound ? 1 : 0;
			}
			return result;
		}
	}

	private static int binarySearch(double[] array, int start, int end, double bound) {
		if (start == end) {
			if (array[start] > bound) {
				return start - 1;
			} else {
				return start;
			}
		} else {
			int mid = (start + end + 1) / 2;
			if (array[mid] < bound) {
				return binarySearch(array, mid, end, bound);
			} else {
				return binarySearch(array, start, mid - 1, bound);
			}
		}
	}

	public static int numExceeding(double[] array, double bound) {
		return numExceeding(array, bound, false);
	}

	public static void appendLineToFile(String lineToWrite, String fileName) throws IOException {
		BufferedWriter out = new BufferedWriter(new FileWriter(fileName, true));
		out.append(lineToWrite);
		out.close();
	}

	public static void writeLineToFile(String lineToWrite, String fileName) throws IOException {
		BufferedWriter out = new BufferedWriter(new FileWriter(fileName, false));
		out.write(lineToWrite);
		out.close();
	}
	
	public static <T> Collection<T> filter(Collection<T> target, Predicate<T> predicate) {
		Collection<T> result = new ArrayList<T>();
		for (T element : target) {
			if (predicate.apply(element)) {
				result.add(element);
			}
		}
		return result;
	}
	
	public static Collection<String> toStrings(Collection<?> collection) {
		Collection<String> result = new ArrayList<String>();
		for (Object o : collection) {
			result.add(o.toString());
		}
		return result;
	}
}
