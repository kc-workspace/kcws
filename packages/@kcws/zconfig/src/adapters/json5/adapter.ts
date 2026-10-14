import type { Adapter } from "#types";
import { resolveParser, toFileParser } from "../content/utils";
import { fileAdapter } from "../file";
import type { Json5AdapterOptions } from "./types";
import { getJson5Files } from "./utils";

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
		files: getJson5Files(),
		...toFileParser(resolveParser("json5", { format: "json5" })),
		...options,
	});

export default json5Adapter;
