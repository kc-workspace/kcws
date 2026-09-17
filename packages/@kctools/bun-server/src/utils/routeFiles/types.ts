export interface RouteSpec {
	/** The original source path specified by the user. */
	source: string;
	/** The resolved path of the source. */
	root: string;
	/** The resolved route associated with the input file. */
	pattern: string;
}

export interface ResolvedRoute {
	/** Absolute path to the HTML document. */
	path: string;
	/** Exact URL path the document answers, e.g. `/about`. */
	route: string;
	/** Wildcard URL path for client side sub-routes, e.g. `/about/*`. */
	wildcard: string;
}
