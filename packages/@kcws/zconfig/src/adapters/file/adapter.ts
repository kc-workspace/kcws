import type { Adapter } from "#types";
import { toAdapterError } from "#utils/errors";
import { applyTransform } from "#utils/transforms";
import type { FileAdapterOptions } from "./types";
import {
	findConfig,
	normalizeOptions,
	readConfig,
	readConfigSync,
} from "./utils";

const LOAD_ERR = "Failed to load config file";

/**
 * Creates an adapter for a custom file format.
 *
 * The adapter uses an explicit `path` when provided. Otherwise, it searches
 * each configured directory and candidate file name until it finds an existing
 * file. Missing files are errors unless `optional` is `true`.
 *
 * @param options - file discovery, parsing, and transformation options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when the file is missing, unreadable, or invalid
 */
const fileAdapter = (options: FileAdapterOptions): Adapter => ({
	name: options.name,
	load: async () => {
		try {
			const opts = normalizeOptions(options);
			const path = findConfig(opts);
			const config = await readConfig(path, opts.parse);
			return applyTransform(config, opts.transform);
		} catch (cause) {
			const message =
				cause instanceof Error ? `${LOAD_ERR}: ${cause.message}` : LOAD_ERR;
			throw toAdapterError(options.name, message, cause);
		}
	},
	loadSync: () => {
		try {
			const opts = normalizeOptions(options);
			const path = findConfig(opts);
			const config = readConfigSync(path, opts.parseSync);
			return applyTransform(config, opts.transform);
		} catch (cause) {
			const message =
				cause instanceof Error ? `${LOAD_ERR}: ${cause.message}` : LOAD_ERR;
			throw toAdapterError(options.name, message, cause);
		}
	},
});

export default fileAdapter;
