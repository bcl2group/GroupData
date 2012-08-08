package JH;

import java.io.*;
import java.util.*;

public class Util {
	public static double mean(ArrayList<Double> list) {
		int n = list.size();
		double s = 0;
		for (double a : list) s += a;
		return s / n;
	}
	public static double variance(ArrayList<Double> list) {
		int n = list.size();
		double m = mean(list);
		double s = 0;
		for (double a : list) s += (a - m) * (a - m);
		return s / (n - 1);
	}
	public static double getMin(double[] arr) {
		double min = arr[0];
		for (double a : arr) {
			if (a < min) min = a;
		}
		return min;
	}
	public static double getMax(double[] arr) {
		double max = arr[0];
		for (double a : arr) {
			if (a > max) max = a;
		}
		return max;
	}
}
