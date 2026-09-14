import { dirname, relative, resolve, sep } from "node:path";
import type * as Bun from "bun";

/**
 * Supported page layouts.
 *
 * - `spa` serves a single HTML document for every request.
 * - `mpa` serves every HTML document of a directory on its own route.
 */
export const MODES = ["spa", "mpa"] as const;

/** Page layout of the served website. */
export type Mode = (typeof MODES)[number];

/** Page layout used when the command is called without `--mode`. */
export const DEFAULT_MODE: Mode = "spa";

/**
 * Input used when the command is called without an explicit one: a file in
 * `spa` mode, a directory in `mpa` mode.
 */
export const DEFAULT_ENTRY: Record<Mode, string> = {
	spa: "./public/index.html",
	mpa: "./src/routes",
};

/** Documents picked up below an `mpa` directory. */
export const PAGE_GLOB = "**/*.html";

/** Document name that serves the route of its own directory. */
const INDEX = "index";

const HTML_EXTENSION = /\.html$/;

/** A single HTML document together with the URL it is served from. */
export interface Entry {
	/** Absolute path to the HTML document. */
	path: string;
	/** Exact URL path the document answers, e.g. `/about`. */
	route: string;
	/** Wildcard URL path for client side sub-routes, e.g. `/about/*`. */
	wildcard: string;
}

/**
 * Return the directory the entries of an input are rooted at.
 *
 * The bundler needs it to keep the source layout in its output: without it Bun
 * derives the root from the common ancestor of the entrypoints, which collapses
 * the layout whenever every page happens to live in the same directory.
 *
 * @param mode - page layout of the served website
 * @param input - file path (`spa`) or directory (`mpa`)
 * @param cwd - directory the input is resolved against
 * @returns absolute path of the root directory
 */
export const entryRoot = (mode: Mode, input: string, cwd: string): string =>
	mode === "spa" ? dirname(resolve(cwd, input)) : resolve(cwd, input);

/**
 * Derive the URL a document answers from its location below `root`.
 *
 * The extension is dropped, and a document named `index` answers the route of
 * its own directory, so `about.html` and `about/index.html` both serve
 * `/about`.
 *
 * @param file - absolute path to the document
 * @param root - absolute path of the directory the documents live in
 * @returns the URL path, e.g. `/about`
 */
const toRoute = (file: string, root: string): string => {
	const segments = relative(root, file)
		.replace(HTML_EXTENSION, "")
		.split(sep)
		.filter((segment) => segment !== "");

	if (segments.at(-1) === INDEX) segments.pop();
	return segments.length === 0 ? "/" : `/${segments.join("/")}`;
};

const toWildcard = (route: string): string =>
	route === "/" ? "/*" : `${route}/*`;

const toEntry = (path: string, route: string): Entry => ({
	path,
	route,
	wildcard: toWildcard(route),
});

/**
 * Return the routes claimed by more than one entry.
 *
 * Both `about.html` and `about/index.html` serve `/about`, so a directory
 * holding the two produces a collision that would otherwise silently overwrite
 * one of them.
 *
 * @param entries - entries to inspect
 * @returns each colliding route, once
 */
export const duplicateRoutes = (entries: Entry[]): string[] => {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const entry of entries) {
		if (seen.has(entry.route)) duplicates.add(entry.route);
		seen.add(entry.route);
	}
	return [...duplicates];
};

/**
 * Resolve the HTML documents a command should serve or build.
 *
 * In `spa` mode the input is the path of the single document. In `mpa` mode it
 * is a directory, and every HTML document below it becomes its own route.
 *
 * @param bun - Bun runtime namespace
 * @param mode - page layout of the served website
 * @param input - file path (`spa`) or directory (`mpa`)
 * @param cwd - directory the input is resolved against
 * @returns entries sorted by route
 */
export const listEntries = (
	bun: typeof Bun,
	mode: Mode,
	input: string,
	cwd: string,
): Entry[] => {
	if (mode === "spa") return [toEntry(resolve(cwd, input), "/")];

	const root = entryRoot(mode, input, cwd);
	const files = [
		...new bun.Glob(PAGE_GLOB).scanSync({
			cwd: root,
			absolute: true,
			onlyFiles: true,
		}),
	];

	return files
		.map((file) => toEntry(file, toRoute(file, root)))
		.sort((a, b) => a.route.localeCompare(b.route));
};
