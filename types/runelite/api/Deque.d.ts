/**
 * A doubly linked list.
 */
interface Deque<T> extends Iterable<T> {
	/**
	 * Add a new element to the end of the deque.
	 * @param t the element
	 */
	addLast(t: T): void;

	/**
	 * Clear the deque.
	 */
	clear(): void;
}
