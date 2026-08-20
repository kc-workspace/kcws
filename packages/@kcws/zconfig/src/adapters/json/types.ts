import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

export interface JsonAdapterOptions extends ExtendFileAdapterOptions {
	/**
	 * Use jsonc-parser to support comments in JSON files.
	 * @default false
	 */
	jsonc?: boolean;
}
export type JsonAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<JsonAdapterOptions>;

import type * as JsonParser from "jsonc-parser";
export type JsonParserModule = typeof JsonParser;
