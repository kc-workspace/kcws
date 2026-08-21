import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

/** Options for {@link json5Adapter}. */
export interface Json5AdapterOptions extends ExtendFileAdapterOptions {}

/** Normalized options used internally by the JSON5 adapter. */
export type Json5AdapterNormalizedOptions =
	NormalizeFileAdapterOptions<Json5AdapterOptions>;

import type * as Json5Module from "json5";
export type Json5ParserModule = typeof Json5Module;
