import type { ExtendNamespace } from "./types";

/** Separator used to compose logger namespace segments. */
export const NS_SEP = ":" as const;

/**
 * Creates a namespace by joining non-empty segments with `:`.
 *
 * @typeParam NS - Parent namespace segment.
 * @typeParam SS - Child namespace segments.
 * @param parent - Parent namespace.
 * @param segments - Child segments to append.
 * @returns Joined namespace string.
 */
export const createNamespace = <NS extends string, SS extends string[]>(
	parent: NS,
	segments: SS,
): ExtendNamespace<NS, SS> =>
	[parent, ...segments]
		.filter((v) => (v?.length ?? 0) > 0)
		.join(NS_SEP) as ExtendNamespace<NS, SS>;
