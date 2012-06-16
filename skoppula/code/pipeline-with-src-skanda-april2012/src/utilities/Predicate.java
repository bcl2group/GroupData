package utilities;

/**
 * Interface used to filter a collection by some predicate.
 * 
 * @author Kent
 *
 * @param <T> the type of objects in the collection
 */
public interface Predicate<T> {
	boolean apply(T type);
}
