import type { Adapter } from "#types";
import { fileAdapter, getConfigFiles, getExtendOptions } from "../file";
import type { JsonAdapterOptions } from "./types";
import { parseJson, parseJsonc } from "./utils";

/**
 * Creates an adapter that reads configuration values from environment
 * variables and, optionally, a dotenv file.
 *
 * @param options - prefix, path separator, dotenv source, and leaf transform
 * @returns an adapter suitable for both config loading entry points
 */
const jsonAdapter = (options: JsonAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "json",
		files: getConfigFiles(["json", "jsonc"], options.name),
		parseSync: (content, file) => {
			// Enable jsonc parsing if the file ends with .jsonc
			if (file.endsWith(".jsonc") || options.jsonc !== false) {
				return parseJsonc(content);
			} else {
				return parseJson(content);
			}
		},
		...getExtendOptions(options),
	});

export default jsonAdapter;
