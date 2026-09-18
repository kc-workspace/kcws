/**
 * Prompt metadata for a single commit type.
 */
export interface TypeEnum {
	description?: string;
	title?: string;
	emoji?: string;
}

/**
 * Map of commit type name to its prompt metadata.
 */
export type TypeObject = Record<string, TypeEnum>;

/**
 * Commit type input.
 *
 * - `"standard"`: all conventional commit types
 * - `"minimal"`: `feat`, `perf`, `fix`, `chore`
 * - `string[]`: exactly the listed types, without metadata
 * - `TypeObject`: custom map of type name to metadata
 */
export type TypeMode = "standard" | "minimal" | string[] | TypeObject;

/**
 * Commit types included in the `"standard"` type mode.
 */
export type StandardType =
	| "feat"
	| "perf"
	| "fix"
	| "docs"
	| "test"
	| "style"
	| "build"
	| "refactor"
	| "ci"
	| "chore"
	| "revert";

/**
 * Commit types included in the `"minimal"` type mode.
 */
export type MinimalType = Extract<
	StandardType,
	"feat" | "perf" | "fix" | "chore"
>;
