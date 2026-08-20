import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

export interface Json5AdapterOptions extends ExtendFileAdapterOptions {}
export type Json5AdapterNormalizedOptions =
	NormalizeFileAdapterOptions<Json5AdapterOptions>;

import type * as Json5Module from "json5";
export type Json5ParserModule = typeof Json5Module;
