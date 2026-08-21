import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

/** Options for {@link jsonAdapter}. */
export interface JsonAdapterOptions extends ExtendFileAdapterOptions {
	/**
	 * Use jsonc-parser to support comments in JSON files.
	 * @default false
	 */
	jsonc?: boolean;
}

/** Normalized options used internally by the JSON adapter. */
export type JsonAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<JsonAdapterOptions>;

import type * as JsonParser from "jsonc-parser";
export type JsonParserModule = typeof JsonParser;
