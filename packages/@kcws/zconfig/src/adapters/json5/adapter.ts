import type { Adapter } from "#types";
import { importSync } from "#utils/imports";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { Json5AdapterOptions, Json5ParserModule } from "./types";

/**
 * Creates an adapter that reads a JSON5 configuration file.
 *
 * The adapter searches the default configuration locations unless `path` or
 * custom discovery options are supplied. Parsed leaf values remain unchanged
 * unless a transform is provided.
 *
 * @param options - file discovery and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a file cannot be found, read, or parsed
 */
const json5Adapter = (options: Json5AdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "json5",
		files: getConfigFiles(["json5"], options.name),
		parseSync: (content) =>
			importSync<Json5ParserModule>("json5", "json5").parse(content),
		...getExtendOptions(options),
	});

export default json5Adapter;
