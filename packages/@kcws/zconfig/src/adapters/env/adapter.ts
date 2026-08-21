import type { Adapter } from "#types";
import type { EnvAdapterOptions } from "./types";
import { createConfig, normalizeOptions } from "./utils";

/**
 * Creates an adapter that reads configuration values from environment
 * variables.
 *
 * Values are read from `processEnv` (`process.env` by default). Environment
 * variable names are decoded into nested camelCase keys using `prefix` and
 * `pathSeparator`.
 *
 * @param options - environment variable source and key decoding options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 */
const envAdapter = (options: Partial<EnvAdapterOptions> = {}): Adapter => ({
	name: "env",
	load: async () => {
		const opts = normalizeOptions(options);
		return createConfig(opts.processEnv, opts);
	},
	loadSync: () => {
		const opts = normalizeOptions(options);
		return createConfig(opts.processEnv, opts);
	},
});

export default envAdapter;
