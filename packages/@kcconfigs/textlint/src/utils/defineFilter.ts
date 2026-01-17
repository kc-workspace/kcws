import type { AnyFilter } from "../models";

export const defineFilter = <R extends AnyFilter>(
	filter: Omit<R, "type">,
): R => {
	return {
		type: "filter",
		...filter,
	} as R;
};
