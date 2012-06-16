package utilities.test;

import static org.junit.Assert.*;

import java.util.Arrays;

import org.junit.Test;

import utilities.Utilities;
import weka.core.Debug.Random;

public class UtilitiesTest {

	@Test
	public void testRandomSubset() {
		int [] randomSubset = Utilities.randomSubset(100, 30, new Random());
		Arrays.sort(randomSubset);
		System.out.println("testRandomSubset : " + Arrays.toString(randomSubset));
	}

	@Test
	public void testColToStringCollectionOfQString() {
		// TODO
	}

	@Test
	public void testNumExceedingDoubleArrayDoubleBoolean() {
		double [] array = {1.3, 4.4, 2.5, -1.0, 3.0};
		assertEquals(Utilities.numExceeding(array, -3.4), 5);
		assertEquals(Utilities.numExceeding(array, 0.0), 4);
		assertEquals(Utilities.numExceeding(array, 2.52), 2);
		assertEquals(Utilities.numExceeding(array, 5.2), 0);
		
		array = new double[]{-1.0, 1.3, 2.5, 3.0, 4.4};
		assertEquals(Utilities.numExceeding(array, -3.4, true), 5);
		assertEquals(Utilities.numExceeding(array, 0.0, true), 4);
		assertEquals(Utilities.numExceeding(array, 2.52, true), 2);
		assertEquals(Utilities.numExceeding(array, 5.2, true), 0);
	}

	@Test
	public void testAppendLineToFile() {
		// TODO
	}

	@Test
	public void testWriteLineToFile() {
		// TODO
	}

}
