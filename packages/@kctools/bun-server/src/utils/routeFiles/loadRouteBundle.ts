import { pathToFileURL } from "node:url";
import type { HTMLBundle } from "bun";

/**
 * Import an HTML route file as a {@link HTMLBundle}.
 *
 * Serving the raw file instead leaves the document untouched, so references
 * such as `<script src="./main.ts">` are never transpiled nor rewritten.
 * Importing the document hands `Bun.serve()` a bundle and lets the bundler
 * resolve every asset the document references.
 *
 * @param path - Absolute path to the HTML document.
 * @returns The bundle produced from the document.
 */
const loadRouteBundle = async (path: string): Promise<HTMLBundle> => {
	const module = (await import(pathToFileURL(path).href)) as {
		default: HTMLBundle;
	};
	return module.default;
};

export default loadRouteBundle;
