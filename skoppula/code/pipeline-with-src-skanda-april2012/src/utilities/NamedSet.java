package utilities;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class NamedSet<T> implements Set<T> {
	
	private Set<T> set;
	private Map<String, T> map;
	
	public NamedSet() {
		clear();
	}

	@Override
	public boolean add(T arg0) {
		if (set.contains(arg0)) {
			return false;
		}
		set.add(arg0);
		map.put(arg0.toString(), arg0);
		return true;
	}

	@Override
	public boolean addAll(Collection<? extends T> arg0) {
		boolean changed = false;
		for (T element : arg0) {
			changed = changed || add(element);
		}
		return changed;
	}

	@Override
	public void clear() {
		set = new HashSet<T>();
		map = new HashMap<String, T>();
	}

	@Override
	public boolean contains(Object arg0) {
		return set.contains(arg0);
	}

	@Override
	public boolean containsAll(Collection<?> arg0) {
		for (Object element : arg0) {
			if (!contains(element)) {
				return false;
			}
		}
		return true;
	}

	@Override
	public boolean isEmpty() {
		return set.isEmpty();
	}

	@Override
	public Iterator<T> iterator() {
		return set.iterator();
	}

	@Override
	public boolean remove(Object arg0) {
		if (!set.contains(arg0)) {
			return false;
		}
		set.remove(arg0);
		map.remove(arg0.toString());
		return true;
	}

	@Override
	public boolean removeAll(Collection<?> arg0) {
		boolean changed = false;
		for (Object element : arg0) {
			changed = changed || remove(arg0);
		}
		return changed;
	}

	@Override
	public boolean retainAll(Collection<?> arg0) {
		throw new UnsupportedOperationException("Method retainAll is not supported for NamedSet");
	}

	@Override
	public int size() {
		return set.size();
	}

	@Override
	public Object[] toArray() {
		return set.toArray();
	}

	@Override
	public <T> T[] toArray(T[] arg0) {
		return set.toArray(arg0);
	}
	
	/**
	 * Returns whether an element in this set has a given String representation.
	 * @param name
	 * @return
	 */
	public boolean contains(String name) {
		return map.containsKey(name);
	}
	
	/**
	 * Returns the element in this set with the given String representation.
	 * @param name
	 * @return
	 */
	public T get(String name) {
		return map.get(name);
	}
	
	public String toString() {
		return set.toString();
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((set == null) ? 0 : set.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof NamedSet)) {
			return false;
		}
		NamedSet other = (NamedSet) obj;
		if (set == null) {
			if (other.set != null) {
				return false;
			}
		} else if (!set.equals(other.set)) {
			return false;
		}
		return true;
	}
	
	
}
