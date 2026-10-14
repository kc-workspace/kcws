import type { RawConfig } from "#types";
import { importAsync, importSync } from "#utils/imports";
import { decodeDotenv } from "../dotenv/utils";
import { parseJson, parseJsonc } from "../json/utils";
import type { Json5ParserModule } from "../json5/types";
import type { TomlParserModule } from "../toml/types";
import type { YamlParserModule } from "../yaml/types";
import type {
	ContentParseOptions,
	ContentParser,
	ContentSource,
} from "./types";

const decoder = new TextDecoder();

/**
 * Converts raw content into a string, decoding bytes as UTF-8.
 *
 * @param content - string or byte content
 * @returns decoded string content
 */
export const decodeContent = (content: ContentSource): string =>
	typeof content === "string" ? content : decoder.decode(content);

/**
 * Resolves a sync and async parser pair from a built-in format or custom parser.
 *
 * Format libraries are optional peers and loaded only when the parser runs.
 *
 * @param name - adapter name, reported when a format library is missing
 * @param options - format or custom parser options
 * @returns parser pair used by content-based adapters
 */
export const resolveParser = (
	name: string,
	options: ContentParseOptions,
): ContentParser => {
	switch (options.format) {
		case "yaml":
			return {
				parseSync: (content) =>
					importSync<YamlParserModule>(name, "yaml").parse(content),
				parse: (content) =>
					importAsync<YamlParserModule>(name, "yaml").then((mod) =>
						mod.parse(content),
					),
			};
		case "json5":
			return {
				parseSync: (content) =>
					importSync<Json5ParserModule>(name, "json5").parse(content),
				parse: (content) =>
					importAsync<Json5ParserModule>(name, "json5").then((mod) =>
						mod.parse(content),
					),
			};
		case "toml":
			return {
				parseSync: (content) =>
					importSync<TomlParserModule>(name, "smol-toml").parse(content),
				parse: (content) =>
					importAsync<TomlParserModule>(name, "smol-toml").then((mod) =>
						mod.parse(content),
					),
			};
		case "json":
			return fromSync(parseJson);
		case "jsonc":
			return fromSync(parseJsonc);
		case "dotenv":
			return fromSync((content) => decodeDotenv(content, options));
		default:
			return {
				parseSync: options.parseSync,
				parse:
					options.parse ??
					((content) => Promise.resolve(options.parseSync(content))),
			};
	}
};

/**
 * Parses content into a raw configuration object, treating an empty document
 * (e.g. an empty YAML string) as an empty configuration.
 *
 * @param parsed - parser output
 * @returns raw configuration object
 */
export const toRawConfig = (parsed: unknown): RawConfig =>
	(parsed ?? {}) as RawConfig;

const fromSync = (parseSync: (content: string) => unknown): ContentParser => ({
	parseSync,
	parse: (content) => Promise.resolve(parseSync(content)),
});
