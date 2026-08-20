import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

/** Options for {@link tomlAdapter}. */
export interface TomlAdapterOptions extends ExtendFileAdapterOptions {}

/** Normalized options used internally by the TOML adapter. */
export type TomlAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<TomlAdapterOptions>;

import type * as TomlModule from "smol-toml";
export type TomlParserModule = typeof TomlModule;
