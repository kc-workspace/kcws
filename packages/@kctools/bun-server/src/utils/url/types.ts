export type RequestHandler = (request: Request) => Promise<Response>;

export interface BasicRoute {
	/**
	 * The route at which the static files will be served.
	 * @example
	 * 	"/images"
	 * 	"/assets"
	 */
	route: string;

	/**
	 * Wildcard URL path for client side sub-routes.
	 * @example
	 * 	"/images/*"
	 * 	"/assets/*"
	 */
	wildcard: string;
}
