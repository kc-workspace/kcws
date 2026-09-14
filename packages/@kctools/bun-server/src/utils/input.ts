import type * as Bun from "bun";
import { type Mode, type ResolvedInput, resolveInput } from "./entries";
import { parseStatics, type StaticSpec } from "./statics";

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
