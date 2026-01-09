import type { AnyArray } from "../configs";
import { isEmpty } from "./empty";

export const isArray = <T extends AnyArray>(value: unknown): value is T => {
	return Array.isArray(value);
};

export const asArray = <T extends AnyArray>(value: unknown): T => {
	if (isEmpty(value)) return [] as unknown as T;
	if (isArray<T>(value)) return value;
	else return [value] as T;
};

/**
 * merge two array together
 */
export const mergeArray = <T>(
	a: T | Array<T> | ReadonlyArray<T> | undefined,
	b: T | Array<T> | ReadonlyArray<T> | undefined,
	fn?: <T>(a: T[], b: T[]) => T[],
): T[] => {
	if (isEmpty(a) && isEmpty(b)) return asArray(undefined);
	if (isEmpty(a)) return asArray(b);
	if (isEmpty(b)) return asArray(a);
	return fn?.(asArray(a), asArray(b)) ?? [...asArray(a), ...asArray(b)];
};

/**
 * append defaults if values is not empty
 */
export const appendArray = <T>(
	defaults: Array<T> | ReadonlyArray<T>,
	values: T | T[] | undefined,
): T[] => {
	if (isEmpty(values)) return asArray(undefined);
	else return mergeArray(defaults, values);
};

export const uniqueArray = <T extends AnyArray>(values: T): T => {
	return Array.from(new Set(values)) as T;
};

export const normalizeArray = <T>(values: Optional<T>[]): T[] => {
	return values.filter((v): v is T => !isEmpty(v));
};
