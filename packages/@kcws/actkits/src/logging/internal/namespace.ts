import type { ExtendNamespace } from "./types";

export const NS_SEP = ":" as const;

export const createNamespace = <NS extends string, SS extends string[]>(
	parent: NS,
	segments: SS,
): ExtendNamespace<NS, SS> =>
	[parent, ...segments]
		.filter((v) => (v?.length ?? 0) > 0)
		.join(NS_SEP) as ExtendNamespace<NS, SS>;
