import { error } from "node:console";
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
	const files = scan(bun, root);

	return files
		.map((file) => toEntry(file, toRoute(file, root)))
		.sort((a, b) => a.route.localeCompare(b.route));
};

/** Scan errors meaning the directory simply is not there. */
const MISSING = new Set(["ENOENT", "ENOTDIR"]);

/**
 * List the HTML documents below `root`, treating a missing directory as empty.
 *
 * @param bun - Bun runtime namespace
 * @param root - absolute path of the directory to scan
 * @returns absolute paths of the matched documents
 */
const scan = (bun: typeof Bun, root: string): string[] => {
	try {
		return [
			...new bun.Glob(PAGE_GLOB).scanSync({
				cwd: root,
				absolute: true,
				onlyFiles: true,
			}),
		];
	} catch (e) {
		const code = (e as { code?: string }).code;
		if (code !== undefined && MISSING.has(code)) return [];
		throw e;
	}
};

/** Everything a command needs about the documents it acts on. */
export interface ResolvedInput {
	/** The documents, sorted by route. */
	entries: Entry[];
	/** Directory the entries are rooted at, for the bundler output layout. */
	root: string;
}

/**
 * Resolve the documents a command should act on, reporting why it cannot.
 *
 * Applies the default input of the mode, then the two checks every command
 * needs: the input has to match at least one document, and no two documents may
 * claim the same route.
 *
 * @param bun - Bun runtime namespace
 * @param mode - page layout of the served website
 * @param input - file path (`spa`) or directory (`mpa`), or the mode default
 * @param cwd - directory the input is resolved against
 * @returns the entries and their root, or `undefined` when nothing is servable
 */
export const resolveInput = (
	bun: typeof Bun,
	mode: Mode,
	input: string | undefined,
	cwd: string,
): ResolvedInput | undefined => {
	const path = input ?? DEFAULT_ENTRY[mode];
	const entries = listEntries(bun, mode, path, cwd);
	if (entries.length === 0) {
		error(`No HTML entry found in ${path}`);
		return undefined;
	}

	const duplicates = duplicateRoutes(entries);
	if (duplicates.length > 0) {
		error(
			`Multiple HTML entries claim the same route: ${duplicates.join(", ")}`,
		);
		return undefined;
	}

	return { entries, root: entryRoot(mode, path, cwd) };
};
