declare global {
	type WithNull<T> = T | null;
	type WithUndefined<T> = T | undefined;
	type Null = undefined | null;

	/**
	 * Type that can be undefined, null, or the original type.
	 */
	type Optional<T> = T | undefined | null;

	/**
	 * @alias Optional
	 * @see {@link Optional}
	 */
	type Nullable<T> = Optional<T>;

	/**
	 * Same as Required, for only K keys.
	 * Anything else, will be partial.
	 *
	 * @beta
	 */
	type RequiredK<T, K extends keyof T = keyof T> = Required<
		Pick<T, Extract<keyof T, K>>
	> &
		Partial<Omit<T, K>>;

	/**
	 * Same as Partial, for only K keys.
	 * Anything else, will be required.
	 *
	 * @beta
	 */
	type PartialK<T, K extends keyof T = keyof T> = Partial<
		Pick<T, Extract<keyof T, K>>
	> &
		Required<Omit<T, K>>;
}

export {};
