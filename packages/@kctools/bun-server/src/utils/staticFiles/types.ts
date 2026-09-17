export interface StaticSpec {
	/**
	 * The original source path specified by the user.
	 * @example
	 * 	"src/images/*.png"
	 * 	"assets"
	 */
	source: string;

	/**
	 * The root directory absolute path of the static source.
	 * @example "/home/user/path"
	 */
	root: string;
	/**
	 * The pattern to match files within the {@link root} directory.
	 * @example
	 * 	"*.png"
	 * 	"**\/*.jpg"
	 */
	pattern: string;

	target: {
		/**
		 * The base absolute path of the target directory.
		 * @example
		 * 	"/home/user/repo"
		 * 	"/home/user/repo/dist"
		 */
		base: string;
		/**
		 * The directory name within the base directory where the static files will be copied to.
		 * @example
		 * 	"images"
		 * 	"assets"
		 */
		dirname: string;
	};
}

export interface ResolvedStatic {
	/**
	 * The route at which the static files will be served.
	 * @example
	 * 	"/images"
	 * 	"/assets"
	 */
	route: string;
	/**
	 * The source absolute path of the static files.
	 */
	source: string;
	/**
	 * The target absolute path where the static files will be copied to.
	 */
	target: string;
}
