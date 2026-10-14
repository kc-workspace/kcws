import type { Adapter } from "#types";
import { resolveParser, toFileParser } from "../content/utils";
import { fileAdapter } from "../file";
import type { YamlAdapterOptions } from "./types";
import { getYamlFiles } from "./utils";

/**
 * Creates an adapter that reads a YAML configuration file.
 *
 * The adapter searches the default configuration locations unless `path` or
 * custom discovery options are supplied. Parsed leaf values remain unchanged
 * unless a transform is provided.
 *
 * @param options - file discovery and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a file cannot be found, read, or parsed
 */
const yamlAdapter = (options: YamlAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "yaml",
		files: getYamlFiles(),
		...toFileParser(resolveParser("yaml", { format: "yaml" })),
		...options,
	});

export default yamlAdapter;
