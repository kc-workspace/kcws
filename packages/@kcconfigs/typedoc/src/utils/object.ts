import type { AnyArray, AnyObject } from "../configs";
import { isArray, mergeArray, normalizeArray } from "./array";
import { isEmpty } from "./empty";

export const isObject = <T extends AnyArray>(value: unknown): value is T => {
	return typeof value === "object" && value !== null && !isArray(value);
};

export const mergeObject = <O extends AnyObject>(
	base: O,
	obj: DeepPartial<O>,
	fn?: <K extends keyof O>(base: O, key: K, value: O[K]) => [boolean, O[K]],
): O => {
	if (isEmpty(base)) base = {} as O;
	if (isEmpty(obj)) return base;

	for (const key in obj) {
		const value = obj[key];
		type Value = O[Extract<keyof DeepPartial<O>, string>];

		if (isObject(value)) {
			base[key] = mergeObject(base[key], value);
		} else if (isArray(value)) {
			base[key] = mergeArray(base[key], value) as Value;
		} else {
			const [ok, result] = fn?.(base, key, value as Value) ?? [
				false,
				undefined,
			];

			if (ok) {
				base[key] = result;
			} else {
				base[key] = value as Value;
			}
		}
	}

	return base;
};

export const normalizeObject = <T extends AnyObject>(obj: T): T => {
	for (const key in obj) {
		const value = obj[key];
		type Value = typeof value;

		if (isObject(value)) {
			obj[key] = normalizeObject(value);
		} else if (isArray(value)) {
			obj[key] = normalizeArray(value) as Value;
		} else if (isEmpty(value)) {
			delete obj[key];
		}
	}

	return obj as T;
};
