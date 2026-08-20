import type { Adapter } from "#types";
import { fileAdapter, getExtendOptions } from "../file";
import type { DotenvAdapterOptions } from "./types";
import { decodeDotenv } from "./utils";

/**
 * Creates an adapter that reads configuration values from a dotenv-style
 * file.
 *
 * Defaults to an optional `.env` file, discovered like other file adapters.
 * File keys are decoded into nested camelCase configuration using `prefix`
 * and `pathSeparator`, matching {@link envAdapter}'s key decoding. File
 * discovery, reading, and error handling are delegated to {@link fileAdapter}.
 *
 * @param options - file discovery, key decoding, and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a required dotenv file cannot be found or parsed
 */
const dotenvAdapter = (options: DotenvAdapterOptions = {}): Adapter =>
	fileAdapter({
		name: "dotenv",
		files: [".env.local", ".env"],
		parseSync: (content) => decodeDotenv(content, options),
		...getExtendOptions(options),
	});

export default dotenvAdapter;
