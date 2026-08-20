import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

/** Options for {@link yamlAdapter}. */
export interface YamlAdapterOptions extends ExtendFileAdapterOptions {}

/** Normalized options used internally by the YAML adapter. */
export type YamlAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<YamlAdapterOptions>;

import type * as YamlModule from "yaml";
export type YamlParserModule = typeof YamlModule;
