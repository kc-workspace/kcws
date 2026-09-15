import { error, warn } from "node:console";
import {
	dirname,
	isAbsolute,
	join,
	normalize,
	relative,
	resolve,
	sep,
} from "node:path";
import type * as Bun from "bun";
import { scanFiles } from "./glob";

/** Separator between the source and the target of a specification. */
const TARGET_SEPARATOR = ":";

/** Characters making a path segment a pattern instead of a plain name. */
const MAGIC = /[*?[\]{}!]/;

/** Pattern matching every document below a directory. */
const DIRECTORY_PATTERN = "**/*";

/** Target standing for the output directory itself. */
const ROOT_TARGET = ".";

/** One `--statics` specification, resolved against the working directory. */
export interface StaticSpec {
	/** The specification as it was written, for messages. */
	source: string;
	/** Absolute directory the pattern is matched from. */
	base: string;
	/** Glob pattern matched below {@link base}. */
	pattern: string;
	/** Directory the matched files are written to, relative to the output. */
	target: string;
}

/**
 * Split a source into the directory it is rooted at and the pattern below it.
 *
 * The root is every leading segment free of glob characters, so the layout
 * below it survives the copy. A source without any of them is a directory when
 * nothing exists under that name, and the document itself when something does.
 *
 * @param bun - Bun runtime namespace
 * @param source - source part of the specification
 * @param cwd - directory relative sources are resolved against
 * @returns the unresolved root and the pattern matched below it
 */
const split = async (
	bun: typeof Bun,
	source: string,
	cwd: string,
): Promise<{ root: string; pattern: string }> => {
	const segments = source.split("/");
	const magic = segments.findIndex((segment) => MAGIC.test(segment));
	if (magic !== -1)
		return {
			root: segments.slice(0, magic).join("/"),
			pattern: segments.slice(magic).join("/"),
		};

	const exists = await bun.file(resolve(cwd, source)).exists();
	return exists
		? { root: dirname(source), pattern: source.split("/").at(-1) ?? source }
		: { root: source, pattern: DIRECTORY_PATTERN };
};

/**
 * Normalize a target, mapping every spelling of the output root onto `.`.
 *
 * A target is always relative to the output directory, so a leading separator
 * means the root rather than the filesystem root.
 *
 * @param target - target part of the specification
 * @returns the normalized target, `.` for the output root
 */
const toTarget = (target: string): string => {
	const trimmed = target.replace(/^\/+/, "");
	if (trimmed === "") return ROOT_TARGET;
	return normalize(trimmed);
};

/** Whether a normalized target reaches outside the output directory. */
const escapes = (target: string): boolean =>
	target === ".." || target.startsWith(`..${sep}`) || isAbsolute(target);

/**
 * Resolve the `--statics` specifications a command was given.
 *
 * A specification is `<source>[:<target>]`: the source is a path or glob read
 * from the working directory, the target the directory the matched files are
 * written to below the output directory. Left out, the target repeats the
 * directory the source is rooted at, which is why `public` lands in
 * `<out>/public` and `public:/` in `<out>` itself.
 *
 * @param bun - Bun runtime namespace
 * @param specs - specifications as they were written on the command line
 * @param cwd - directory relative sources are resolved against
 * @returns the resolved specifications, or `undefined` when one is unusable
 */
export const parseStatics = async (
	bun: typeof Bun,
	specs: string[],
	cwd: string,
): Promise<StaticSpec[] | undefined> => {
	const parsed: StaticSpec[] = [];
	for (const spec of specs) {
		const separator = spec.lastIndexOf(TARGET_SEPARATOR);
		const source = separator === -1 ? spec : spec.slice(0, separator);
		const written = separator === -1 ? undefined : spec.slice(separator + 1);

		const { root, pattern } = await split(bun, source, cwd);
		if (written === undefined && isAbsolute(root)) {
			error(
				`Static source ${source} needs an explicit target: ${source}:<target>`,
			);
			return undefined;
		}

		const target = toTarget(written ?? root);
		if (escapes(target)) {
			// a target left out is derived from the source, so report the one that
			// actually escapes rather than the absent one
			error(`Static target ${written ?? target} escapes the output directory`);
			return undefined;
		}

		parsed.push({ source: spec, base: resolve(cwd, root), pattern, target });
	}
	return parsed;
};

/** A file copied as it is, together with where it is written. */
export interface StaticFile {
	/** Absolute path of the source file. */
	from: string;
	/** Path it is written to, relative to the output directory. */
	to: string;
}

/**
 * List the files the specifications match, reporting the ones matching none.
 *
 * A directory of static files usually holds the HTML documents too, and those
 * are the bundler's to write: copying one beside its bundled self would either
 * collide with it or ship the page untransformed. They are skipped here, so
 * `--statics public:/` means "everything in `public` the build does not
 * already produce".
 *
 * A specification matching nothing is worth saying out loud — the pattern is
 * likely a typo — but it is not worth stopping over: the rest of the website
 * still builds without it.
 *
 * @param bun - Bun runtime namespace
 * @param specs - resolved specifications to match
 * @param built - absolute paths of the documents the command builds itself
 * @returns the matched files, sorted by output path
 */
export const listStatics = (
	bun: typeof Bun,
	specs: StaticSpec[],
	built: ReadonlySet<string> = new Set(),
): StaticFile[] => {
	const files: StaticFile[] = [];
	for (const spec of specs) {
		const matched = scanFiles(bun, spec.base, spec.pattern, true).filter(
			(file) => !built.has(file),
		);
		if (matched.length === 0) {
			warn(`No static file found in ${spec.source}`);
			continue;
		}

		for (const file of matched)
			files.push({
				from: file,
				to: join(spec.target, relative(spec.base, file)),
			});
	}
	return files.sort((a, b) => a.to.localeCompare(b.to));
};

/**
 * Return the URL a file is served from during development.
 *
 * The development server answers a static file where the built website would
 * have it, so the same markup works before and after a build. Each segment is
 * encoded, or a name holding a space or a `#` would never match the request
 * the browser sends for it.
 *
 * @param file - file to serve
 * @returns the URL path, e.g. `/favicon.ico`
 */
export const staticRoute = (file: StaticFile): string =>
	`/${file.to.split(sep).map(encodeURIComponent).join("/")}`;

/**
 * Return the output paths claimed by more than one file.
 *
 * Two specifications can point at the same output path, and copying both would
 * silently keep whichever is written last.
 *
 * @param files - files to inspect
 * @returns each colliding output path, once
 */
export const duplicateTargets = (files: StaticFile[]): string[] => {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const file of files) {
		if (seen.has(file.to)) duplicates.add(file.to);
		seen.add(file.to);
	}
	return [...duplicates];
};

/**
 * Copy every file into the output directory, keeping its output path.
 *
 * @param bun - Bun runtime namespace
 * @param files - files to copy
 * @param outdir - absolute path of the output directory
 */
export const copyStatics = async (
	bun: typeof Bun,
	files: StaticFile[],
	outdir: string,
): Promise<void> => {
	for (const file of files)
		await bun.write(resolve(outdir, file.to), bun.file(file.from));
};
