package interactions;

import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Class for representing a table or spreadsheet. This is necessary since yEd accepts node and edge lists in tabular
 * format.
 * 
 * @author Kent
 * 
 */
public class Table {
	/**
	 * The internal representation of the table. Each column corresponds to a value in this map, with the corresponding
	 * key being the first row of the column (the property).
	 */
	final Map<String, List<String>> entries;
	/**
	 * An array containing the first row of the table (the properties of the columns).
	 */
	final String[] properties;

	/**
	 * Constructs a new table with the given array of properties.
	 * 
	 * @param properties
	 *            the array of properties.
	 */
	public Table(String[] properties) {
		entries = new LinkedHashMap<String, List<String>>();
		this.properties = properties;
		for (String property : properties) {
			entries.put(property, new LinkedList<String>());
		}
	}

	/**
	 * Adds an entry to the table, under the column indicated by the given property.
	 * 
	 * @param property
	 *            the property of the column to be added under.
	 * @param value
	 *            the value to be added to this column.
	 */
	public void addEntry(String property, String value) {
		if (entries.get(property) == null) {
			throw new RuntimeException("Table contains no column with header " + property);
		}
		entries.get(property).add(value);
	}

	/**
	 * Appends the given table to this table. This method works only when the column names of the tables match; in that
	 * case, each value (excluding the column name) of the given table is added to the corresponding column of this
	 * table.
	 * 
	 * @param other
	 *            the other table to be appended.
	 */
	public void append(Table other) {
		if (Arrays.equals(properties, other.properties)) {
			for (String property : properties) {
				entries.get(property).addAll(other.entries.get(property));
			}
		}
	}

	/**
	 * Returns a String representation of the table. This representation is tab-delimited. For example, a table with
	 * properties p1, p2, p3 and values v11, v12, v13 (corresponding to p1), v21 (corresponding to p2), v31, v32
	 * (corresponding to p3) would yield the String <br />
	 * <CODE>p1\tp2\tp3\nv11\tv21\tv31\nv12\t\tv32\nv13\t\t\n</CODE> <br />
	 * and would be displayed in a text editor as follows: <br />
	 * 
	 * <PRE>
	 * p1	p2	p3
	 * v11	v21	v31
	 * v12		v32
	 * v13
	 * </PRE>
	 * 
	 * @return the String representation as described above.
	 */
	public String toString() {
		String result = "";
		LinkedList<Iterator<String>> iterators = new LinkedList<Iterator<String>>();

		Iterator<String> propertyIterator = Arrays.asList(properties).iterator();
		String header = "";
		while (propertyIterator.hasNext()) {
			String property = propertyIterator.next();
			iterators.add(entries.get(property).iterator());
			header += "\"" + property + "\"";
			if (propertyIterator.hasNext()) {
				header += ",";
			}
		}
		result += header + "\n";

		while (hasNext(iterators)) {
			String nextRow = "";
			Iterator<Iterator<String>> it_iterator = iterators.iterator();
			while (it_iterator.hasNext()) {
				Iterator<String> iterator = it_iterator.next();
				if (iterator.hasNext()) {
					nextRow += "\"" + iterator.next() + "\"";
				}
				if (it_iterator.hasNext()) {
					nextRow += ",";
				}
			}
			result += nextRow + "\n";
		}

		return result;
	}

	/**
	 * Check if there is a next element for any of the iterators in a list.
	 * 
	 * @param iterators
	 *            the list of iterators.
	 * @return <CODE>true</CODE> if at least one of the iterators has a next element.
	 */
	boolean hasNext(List<? extends Iterator<?>> iterators) {
		for (Iterator<?> iter : iterators) {
			if (iter.hasNext()) {
				return true;
			}
		}
		return false;
	}
}
