import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

export interface TomlAdapterOptions extends ExtendFileAdapterOptions {}
export type TomlAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<TomlAdapterOptions>;

import type * as TomlModule from "smol-toml";
export type TomlParserModule = typeof TomlModule;
