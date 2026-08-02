declare global {
	/**
	 * A type representing a record with string keys and values of any type.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: Necessary for generic config type
	type AnyRecord = Record<string, any>;

	/**
	 * A constructor type that creates instances of type T.
	 *
	 * @template T - The type of object that the constructor creates. Defaults to an empty object type.
	 */
	// biome-ignore lint/suspicious/noExplicitAny: argument and class can be anything so unknown or object won't work
	type Constructor<T = any> = new (...args: any[]) => T;

	/**
	 * A type that extends T to include null as a possible value.
	 *
	 * @template T - The base type to extend with null.
	 */
	type WithNull<T> = T | null;
	/**
	 * A type that extends T to include undefined as a possible value.
	 *
	 * @template T - The base type to extend with undefined.
	 */
	type WithUndefined<T> = T | undefined;
	/**
	 * A type representing the absence of a value, either undefined or null.
	 */
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

	/**
	 * A utility type that makes all properties of T deeply optional.
	 * This means that not only the properties of T are optional,
	 * but also all nested properties within those properties are optional as well.
	 *
	 * @beta
	 */
	type DeepPartial<T> = T extends object
		? {
				[P in keyof T]?: DeepPartial<T[P]>;
			}
		: T;
}

export {};
