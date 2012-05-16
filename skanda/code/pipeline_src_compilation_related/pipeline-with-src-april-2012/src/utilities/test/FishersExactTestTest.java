package utilities.test;

import static org.junit.Assert.*;

import org.junit.Test;

import utilities.FishersExactTest;

public class FishersExactTestTest {

	@Test
	public void testProb() {
		assertEquals(FishersExactTest.prob(5, 0, 1, 4), 0.0238, 0.0001);
		assertEquals(FishersExactTest.prob(3, 2, 3, 2), 0.4762, 0.0001);
	}

	@Test
	public void testRun() {
//		assertEquals(FishersExactTest.run(5, 0, 1, 4), 0.0476, 0.0001);
//		assertEquals(FishersExactTest.run(3, 2, 3, 2), 1.0, 0.0001);
//		
//		assertEquals(FishersExactTest.run(14, 23, 15, 29), 0.8174, 0.0001);
//		assertEquals(FishersExactTest.run(162, 123, 132, 143), 0.0422, 0.0001);
		
//		FishersExactTest.scale = 50;
//		System.out.println(FishersExactTest.run(3, 197, 200, 20000));
//		
//		FishersExactTest.scale = 100;
//		System.out.println(FishersExactTest.run(3, 197, 200, 20000));
//		
//		FishersExactTest.scale = 200;
//		System.out.println(FishersExactTest.run(3, 197, 200, 20000));
		
		System.out.println(FishersExactTest.run(15, 17, 24, 19));
	}

}
