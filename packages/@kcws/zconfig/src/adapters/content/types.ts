import type { BaseAdapterOptions } from "#types";

/** Built-in formats that {@link contentAdapter} and {@link streamAdapter} can parse. */
export type ContentFormat =
	| "yaml"
	| "json"
	| "jsonc"
	| "json5"
	| "toml"
	| "dotenv";

/** Raw configuration content; `Uint8Array` (including `Buffer`) is decoded as UTF-8. */
export type ContentSource = string | Uint8Array;

/** Parses raw configuration content with a built-in format other than dotenv. */
export interface ContentFormatOptions {
	/** Built-in format used to parse the content. */
	format: Exclude<ContentFormat, "dotenv">;
}

/** Parses raw configuration content as dotenv and decodes its keys like {@link envAdapter}. */
export interface ContentDotenvFormatOptions {
	/** Built-in format used to parse the content. */
	format: "dotenv";
	/** Prefix required by environment variable names; an underscore is appended when absent. */
	prefix?: string;
	/** Separator between nested configuration keys in environment variable names. @default `"__"` */
	pathSeparator?: string;
}

/** Parses raw configuration content with a custom parser. */
export interface ContentParserOptions {
	/** Must be omitted when a custom parser is supplied. */
	format?: undefined;
	/**
	 * Parses configuration content into a JavaScript object synchronously.
	 * @param content - the decoded configuration content
	 * @returns the parsed configuration object
	 */
	parseSync: <T>(content: string) => T;
	/**
	 * Parses configuration content into a JavaScript object asynchronously.
	 * Defaults to calling `parseSync` in a resolved Promise.
	 *
	 * @param content - the decoded configuration content
	 * @returns the parsed configuration object
	 */
	parse?: <T>(content: string) => Promise<T>;
}

/** Selects how raw content is parsed: a built-in format or a custom parser. */
export type ContentParseOptions =
	| ContentFormatOptions
	| ContentDotenvFormatOptions
	| ContentParserOptions;

/** Options shared by content-based adapters. */
export type BaseContentAdapterOptions = BaseAdapterOptions &
	ContentParseOptions & {
		/** Stable adapter identifier used in error messages. */
		name?: string;
	};

/** Options for {@link contentAdapter}. */
export type ContentAdapterOptions = BaseContentAdapterOptions & {
	/**
	 * Configuration content, or a function returning it.
	 * A function is called on every load, so it can return fresh content.
	 */
	content: ContentSource | (() => ContentSource);
};

/** Parser pair resolved from {@link ContentParseOptions}. */
export interface ContentParser {
	/** Parses content synchronously. */
	parseSync: (content: string) => unknown;
	/** Parses content asynchronously. */
	parse: (content: string) => Promise<unknown>;
}
