import type { AnyRule } from "../models";

export const defineRule = <R extends AnyRule>(rule: Omit<R, "type">): R => {
	return {
		type: "rule",
		...rule,
	} as R;
};
