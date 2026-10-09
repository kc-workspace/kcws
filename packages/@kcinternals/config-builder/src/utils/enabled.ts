import type { WithEnabled } from "../types";

export const withEnabled = <T>(
	value: WithEnabled<T> | undefined,
	ifTrue: T,
): T | undefined => {
	if (typeof value === "boolean") return value ? ifTrue : undefined;
	return value;
};
