import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { YamlAdapterOptions, YamlParserModule } from "./types";

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
		files: getConfigFiles(["yml", "yaml"], options.name),
		parseSync: (content) =>
			importSync<YamlParserModule>("yaml", "yaml").parse(content),
		...getExtendOptions(options),
	});

export default yamlAdapter;
