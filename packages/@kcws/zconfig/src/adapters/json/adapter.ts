import type { Adapter } from "#types";
import { fileAdapter } from "../file";
import type { JsonAdapterOptions } from "./types";
import { getJsonFiles, parseJson, parseJsonc } from "./utils";

/**
 * Creates an adapter that reads a JSON or JSONC configuration file.
 *
 * JSON files use JSONC parsing by default so comments are supported. Set
 * `jsonc` to `false` to require strict JSON for `.json` files; `.jsonc`
 * files always use JSONC parsing.
 *
 * @param options - file discovery, parsing, and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a file cannot be found, read, or parsed
 */
const jsonAdapter = (options: JsonAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "json",
		files: getJsonFiles(),
		parseSync: (content, file) => {
			// Enable jsonc parsing if the file ends with .jsonc
			if (file.endsWith(".jsonc") || options.jsonc !== false) {
				return parseJsonc(content);
			} else {
				return parseJson(content);
			}
		},
		...options,
	});

export default jsonAdapter;
