import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

export interface YamlAdapterOptions extends ExtendFileAdapterOptions {}
export type YamlAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<YamlAdapterOptions>;

import type * as YamlModule from "yaml";
export type YamlParserModule = typeof YamlModule;
