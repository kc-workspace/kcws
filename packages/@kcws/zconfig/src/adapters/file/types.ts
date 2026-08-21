import type { BaseAdapterOptions } from "#types";

/** Options for creating a custom file-backed configuration adapter. */
export interface FileAdapterOptions extends BaseAdapterOptions {
	/**
	 * Stable adapter identifier used in error messages.
	 */
	name: string;

	/**
	 * Candidate file names searched in order within each configured directory.
	 */
	files: string[];

	/**
	 * Explicit file path, resolved relative to the current working directory.
	 * When set, directory and file discovery options are ignored.
	 */
	path?: string;

	/**
	 * Directory paths to search for configuration files.
	 * @default [process.cwd()]
	 */
	directories?: string[];

	/**
	 * Whether a missing configuration file should return an empty object.
	 * @default true
	 */
	optional?: boolean;

	/**
	 * Parses configuration file content into a JavaScript object synchronously.
	 * @param content - The existing configuration content
	 * @param file - The configuration file absolute path
	 * @returns The parsed configuration object
	 */
	parseSync: <T>(content: string, file: string) => T;

	/**
	 * Parses configuration file content into a JavaScript object asynchronously.
	 * Defaults to calling `parseSync` in a resolved Promise.
	 *
	 * @param content - The existing configuration content
	 * @param file - The configuration file absolute path
	 * @returns The parsed configuration object
	 */
	parse?: <T>(content: string, file: string) => Promise<T>;
}

/** File adapter options after discovery and parser defaults are applied. */
export type FileAdapterNormalizedOptions = Required<
	Omit<FileAdapterOptions, "transform" | "path">
> & {
	path: string | undefined;
	transform: BaseAdapterOptions["transform"] | undefined;
};

/** Base options that format-specific file adapters can extend. */
export type ExtendFileAdapterOptions = Partial<
	Omit<FileAdapterOptions, "parse" | "parseSync">
>;

/** Converts format-specific file options into file adapter options. */
export type NormalizeFileAdapterOptions<O> = O extends ExtendFileAdapterOptions
	? Required<Omit<O, keyof ExtendFileAdapterOptions>> & ExtendFileAdapterOptions
	: never;
