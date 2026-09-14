import { dirname, relative, resolve, sep } from "node:path";
import type * as Bun from "bun";

/**
 * Supported page layouts.
 *
 * - `spa` serves a single HTML document for every request.
 * - `mpa` serves one HTML document per route directory.
 */
export const MODES = ["spa", "mpa"] as const;

/** Page layout of the served website. */
export type Mode = (typeof MODES)[number];

/** Page layout used when the command is called without `--mode`. */
export const DEFAULT_MODE: Mode = "spa";

/** Entry pattern used when the command is called without an explicit one. */
export const DEFAULT_ENTRY: Record<Mode, string> = {
	spa: "./public/index.html",
	mpa: "./src/routes/**/index.html",
};

/** A single HTML document together with the URL it is served from. */
export interface Entry {
	/** Absolute path to the HTML document. */
	path: string;
	/** Exact URL path the document answers, e.g. `/about`. */
	route: string;
	/** Wildcard URL path for client side sub-routes, e.g. `/about/*`. */
	wildcard: string;
}

/** Metacharacters that make a `Bun.Glob` segment non-literal. */
const GLOB_CHARS = /[*?[\]{}]/;

/**
 * Return the static directory prefix of a glob pattern, i.e. every leading
 * segment before the first one containing a wildcard.
 *
 * @param pattern - glob pattern, e.g. `./src/routes/∗∗\/index.html`
 * @returns the static prefix, e.g. `./src/routes`
 */
export const globBase = (pattern: string): string => {
	const segments = pattern.split("/");
	const statics: string[] = [];
	for (const segment of segments) {
		if (GLOB_CHARS.test(segment)) break;
		statics.push(segment);
	}

	// the last static segment is the file name unless a wildcard stopped us
	if (statics.length === segments.length) statics.pop();
	const base = statics.join("/");
	return base === "" ? "." : base;
};

const toRoute = (file: string, base: string): string => {
	const relativeDir = relative(base, dirname(file));
	if (relativeDir === "") return "/";
	return `/${relativeDir.split(sep).join("/")}`;
};

const toWildcard = (route: string): string =>
	route === "/" ? "/*" : `${route}/*`;

const toEntry = (path: string, route: string): Entry => ({
	path,
	route,
	wildcard: toWildcard(route),
});

/**
 * Return the directory the entries of a pattern are rooted at.
 *
 * The bundler needs it to keep the source layout in its output: without it Bun
 * derives the root from the common ancestor of the entrypoints, which collapses
 * the layout whenever every page happens to live in the same directory.
 *
 * @param mode - page layout of the served website
 * @param pattern - file path (`spa`) or glob pattern (`mpa`)
 * @param cwd - directory the pattern is resolved against
 * @returns absolute path of the root directory
 */
export const entryRoot = (mode: Mode, pattern: string, cwd: string): string =>
	mode === "spa"
		? dirname(resolve(cwd, pattern))
		: resolve(cwd, globBase(pattern));

/**
 * Return the routes claimed by more than one entry.
 *
 * A route is derived from the directory of its document, so a pattern matching
 * several documents in one directory produces collisions that would otherwise
 * silently overwrite each other.
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
 * In `spa` mode the pattern is a single file path. In `mpa` mode the pattern is
 * a glob and every match becomes its own route, derived from the directory path
 * relative to the static prefix of the glob.
 *
 * @param bun - Bun runtime namespace
 * @param mode - page layout of the served website
 * @param pattern - file path (`spa`) or glob pattern (`mpa`)
 * @param cwd - directory the pattern is resolved against
 * @returns entries sorted by route
 */
export const listEntries = (
	bun: typeof Bun,
	mode: Mode,
	pattern: string,
	cwd: string,
): Entry[] => {
	if (mode === "spa") return [toEntry(resolve(cwd, pattern), "/")];

	const base = resolve(cwd, globBase(pattern));
	const files = [
		...new bun.Glob(pattern).scanSync({
			cwd,
			absolute: true,
			onlyFiles: true,
		}),
	];

	return files
		.map((file) => toEntry(file, toRoute(file, base)))
		.sort((a, b) => a.route.localeCompare(b.route));
};
