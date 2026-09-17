import type { BasicRoute } from "#utils/url";

export interface RouteSpec {
	/** The original source path specified by the user. */
	source: string;
	/** The resolved path of the source. */
	root: string;
	/** The resolved route associated with the input file. */
	pattern: string;
}

export interface ResolvedRoute extends BasicRoute {
	/** Absolute path to the HTML document. */
	path: string;
}
