package main2;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import org.junit.Test;
import static org.junit.Assert.*;

import utilities.NamedSet;


public class ExtractGeneSymbolsTest {
	
	@Test
	public void testRun() throws IOException {
		Properties p = new Properties();
		p.setProperty("snpToGenes", "test/inputs/table_with_parents_reduced.txt");
		
		ExtractGeneSymbols egs = new ExtractGeneSymbols(p);
		NamedSet<Gene> genes = egs.run();
		
		BufferedReader input = new BufferedReader(new FileReader("test/outputs/snpToGenes.txt"));
		NamedSet<Gene> expectedGenes = new NamedSet<Gene>();
		String line = null;
		while ((line = input.readLine()) != null) {
			if (line.equals("")) {
				continue;
			}
			
			String [] components = line.split("\t");
			Gene gene = new Gene(components[0].trim());
			for (String snpString : components[1].split(",")) {
				gene.addSNP(new SNP(snpString.trim()));
			}
			expectedGenes.add(gene);
		}
		
		assertEquals(genes.size(), expectedGenes.size());
//		assertEquals(genes, expectedGenes);
	}
}
