import { error } from "node:console";
import type * as Bun from "bun";
import { type Mode, type ResolvedInput, resolveInput } from "./entries";
import {
	duplicateTargets,
	listStatics,
	parseStatics,
	type StaticFile,
	type StaticSpec,
} from "./statics";

/** The options every command resolving an input is given. */
export interface InputOptions {
	/** Page layout of the served website. */
	mode: Mode;
	/** `--statics` specifications as they were written. */
	statics: string[];
}

/** Everything a command acts on: the documents and the files copied as they are. */
export interface CommandInput extends ResolvedInput {
	/** Static file specifications the command was given. */
	statics: StaticSpec[];
}

/**
 * Resolve what a command acts on, reporting why it cannot.
 *
 * `dev` and `build` differ in what they do with the result, not in how they
 * read it, so both take the documents and the static files from here. Nothing
 * is resolved past the first problem: a command that cannot find a page has no
 * use for its static files.
 *
 * @param bun - Bun runtime namespace
 * @param options - the `--mode` and `--statics` values the command was given
 * @param input - file path (`spa`) or directory (`mpa`), or the mode default
 * @param cwd - directory the input is resolved against
 * @returns the documents, their root, and the specifications, or `undefined`
 */
export const resolveCommandInput = async (
	bun: typeof Bun,
	options: InputOptions,
	input: string | undefined,
	cwd: string,
): Promise<CommandInput | undefined> => {
	const resolved = resolveInput(bun, options.mode, input, cwd);
	if (resolved === undefined) return undefined;

	const specs = await parseStatics(bun, options.statics, cwd);
	if (specs === undefined) return undefined;

	return { ...resolved, statics: specs };
};

/**
 * Match the static files a command copies or serves, reporting why it cannot.
 *
 * The documents the command builds are left out: they are the bundler's to
 * write. Two files landing on one output path would silently keep whichever
 * was written last, so that is where this stops.
 *
 * @param bun - Bun runtime namespace
 * @param input - what the command resolved to act on
 * @returns the matched files, or `undefined` when two claim one path
 */
export const collectStatics = (
	bun: typeof Bun,
	input: CommandInput,
): StaticFile[] | undefined => {
	const built = new Set(input.entries.map((entry) => entry.path));
	const files = listStatics(bun, input.statics, built);

	const duplicates = duplicateTargets(files);
	if (duplicates.length > 0) {
		error(
			`Multiple static files claim the same path: ${duplicates.join(", ")}`,
		);
		return undefined;
	}

	return files;
};
