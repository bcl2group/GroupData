package interactions;

/**
 * Object representing an unordered pair of elements, both of the same type. Note that the elements are still labelled
 * first and second; the adjective 'unordered' refers to the fact that pairs are compared regardless of ordering.
 * 
 * @param <E>
 *            the type of the elements.
 */
class UOPair<E> {
	/**
	 * The first element of the pair
	 */
	private final E first;
	/**
	 * The second element of the pair.
	 */
	private final E second;

	/**
	 * Constructs a pair with the given objects.
	 * 
	 * @param first
	 *            the first element.
	 * @param second
	 *            the second element.
	 */
	UOPair(E first, E second) {
		this.first = first;
		this.second = second;
	}

	/**
	 * Returns the hashcode of this pair. In particular, the sum of the hashcodes of the elements in the pair is
	 * returned. This means that two pairs with the same elements but in different order have the same hashcode.
	 * 
	 * @return the hashcode of this object.
	 */
	@Override
	public int hashCode() {
		int firstHash = 0;
		int secondHash = 0;
		if (first != null) {
			firstHash = first.hashCode();
		}
		if (second != null) {
			secondHash = second.hashCode();
		}
		return firstHash + secondHash;
	}

	/**
	 * Returns whether a given object is equivalent to this object. This is true if the either both objects are null, or
	 * the given object is a UOPair which contains the same elements as this one (possibly in reverse order).
	 * 
	 * @return <CODE>true</CODE> if the given object is equivalent to this one, as specified above.
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof UOPair)) {
			return false;
		}

		@SuppressWarnings("unchecked")
		UOPair<E> other = (UOPair<E>) obj;
		if (first == null && second == null) {
			return other.first == null && other.second == null;
		} else if (first == null) {
			if (other.first == null) {
				return second.equals(other.second);
			} else {
				return other.second == null && second.equals(other.first);
			}
		} else if (second == null) {
			if (other.first == null) {
				return first.equals(other.second);
			} else {
				return other.second == null && first.equals(other.first);
			}
		} else {
			return (first.equals(other.first) && second.equals(other.second))
					|| (second.equals(other.first) && first.equals(other.second));
		}
	}

	/**
	 * Returns a String representation of this object.
	 * 
	 * @return a String representation of this object.
	 */
	public String toString() {
		return first.toString() + "~" + second.toString();
	}
}