import type { Adapter } from "#types";
import { toFileParserByPath } from "../content/utils";
import { fileAdapter } from "../file";
import type { JsonAdapterOptions } from "./types";
import { getJsonFiles } from "./utils";

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
		...toFileParserByPath("json", (file) => ({
			// Enable jsonc parsing if the file ends with .jsonc
			format:
				file.endsWith(".jsonc") || options.jsonc !== false ? "jsonc" : "json",
		})),
		...options,
	});

export default jsonAdapter;
