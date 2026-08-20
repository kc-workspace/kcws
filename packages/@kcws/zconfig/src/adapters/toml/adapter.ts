import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { TomlAdapterOptions, TomlParserModule } from "./types";

/**
 * Creates an adapter that reads a TOML configuration file.
 *
 * The adapter searches the default configuration locations unless `path` or
 * custom discovery options are supplied. Parsed leaf values remain unchanged
 * unless a transform is provided.
 *
 * @param options - file discovery and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a file cannot be found, read, or parsed
 */
const tomlAdapter = (options: TomlAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "toml",
		files: getConfigFiles(["toml"], options.name),
		parseSync: <T>(content: string): T =>
			importSync<TomlParserModule>("toml", "smol-toml").parse(content) as T,
		...getExtendOptions(options),
	});

export default tomlAdapter;
