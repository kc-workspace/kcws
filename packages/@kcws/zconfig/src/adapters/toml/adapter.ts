import type { Adapter } from "#types";
import { importAsync, importSync } from "#utils/imports";
import { fileAdapter } from "../file";
import type { TomlAdapterOptions, TomlParserModule } from "./types";
import { getTomlFiles } from "./utils";

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
		files: getTomlFiles(),
		parseSync: <T>(content: string): T =>
			importSync<TomlParserModule>("toml", "smol-toml").parse(content) as T,
		parse: <T>(content: string): Promise<T> =>
			importAsync<TomlParserModule>("toml", "smol-toml").then(
				(mod) => mod.parse(content) as T,
			),
		...options,
	});

export default tomlAdapter;
