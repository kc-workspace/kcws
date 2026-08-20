import type { BaseAdapterOptions } from "../../types";

export interface FileAdapterOptions extends BaseAdapterOptions {
	/**
	 * Adapter name
	 */
	name: string;

	/**
	 * File names to search for configuration files.
	 */
	files: string[];

	/**
	 * Explicit file path, resolved relative to the current working directory.
	 */
	path?: string;

	/**
	 * Directory paths to search for configuration files.
	 * @default [process.cwd(), os.homedir()]
	 */
	directories?: string[];

	/**
	 * Whether a missing configuration file should return an empty object.
	 * @default false
	 */
	optional?: boolean;

	/**
	 * Parse the configuration file content into a JavaScript object.
	 * @param content - The existing configuration content
	 * @param file - The configuration file absolute path
	 * @returns The parsed configuration object
	 *
	 * @see {@link parse} for asynchronous parsing
	 */
	parseSync: <T>(content: string, file: string) => T;

	/**
	 * Parse the configuration file content into a JavaScript object.
	 * Default implementation is to call `parseSync` in a Promise.
	 *
	 * @param content - The existing configuration content
	 * @param file - The configuration file absolute path
	 * @returns The parsed configuration object
	 *
	 * @see {@link parseSync} for synchronous parsing
	 */
	parse?: <T>(content: string, file: string) => Promise<T>;
}

export type FileAdapterNormalizedOptions = Required<
	Omit<FileAdapterOptions, "transform" | "path">
> & {
	path: string | undefined;
	transform: BaseAdapterOptions["transform"] | undefined;
};

/** For custom file adapters to extend as base option */
export type ExtendFileAdapterOptions = Partial<
	Omit<FileAdapterOptions, "parse" | "parseSync">
>;

export type NormalizeFileAdapterOptions<O> = O extends ExtendFileAdapterOptions
	? Required<Omit<O, keyof ExtendFileAdapterOptions>> & ExtendFileAdapterOptions
	: never;
