package utilities.test;

import static org.junit.Assert.*;

import org.junit.Test;

import utilities.PearsonChiSquareTest;

public class PearsonChiSquareTestTest {

	@Test
	public void testChiSq() {
		// assertEquals(PearsonChiSquareTest.chiSq(14, 23, 15, 29), 0.0139, 0.0001);
		assertEquals(PearsonChiSquareTest.chiSq(152, 123, 132, 143), 2.6283, 0.0001);
	}

}
