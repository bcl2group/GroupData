package utilities;

public class PearsonChiSquareTest {
	public static double chiSq(int a, int b, int c, int d) {
		double expC = (double) a / (a + b) * (c + d);
		double expD = (double) b / (a + b) * (c + d);
		return Math.pow(c - expC, 2) / expC + Math.pow(d - expD, 2) / expD;
	}
}
