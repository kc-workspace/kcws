import type { Adapter } from "#types";
import { resolveParser, toFileParser } from "../content/utils";
import { fileAdapter } from "../file";
import type { TomlAdapterOptions } from "./types";
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
		...toFileParser(resolveParser("toml", { format: "toml" })),
		...options,
	});

export default tomlAdapter;
