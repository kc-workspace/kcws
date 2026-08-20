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
