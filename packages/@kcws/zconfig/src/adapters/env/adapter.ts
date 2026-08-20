import type { Adapter } from "#types";
import { importAsync, importSync } from "#utils/imports";
import type { DotenvModule, EnvAdapterOptions } from "./types";
import { createConfig, loadEnv, normalizeOptions } from "./utils";

/**
 * Creates an adapter that reads configuration values from environment
 * variables and, optionally, a dotenv file.
 *
 * @param options - prefix, path separator, dotenv source, and leaf transform
 * @returns an adapter suitable for both config loading entry points
 */
const envAdapter = (options: Partial<EnvAdapterOptions> = {}): Adapter => ({
	name: "env",
	load: async () => {
		const opts = normalizeOptions(options);
		const parser = await importAsync<DotenvModule>(envAdapter.name, "dotenv");
		const env = loadEnv(parser, opts);
		return createConfig(env, opts);
	},
	loadSync: () => {
		const opts = normalizeOptions(options);
		const parser = importSync<DotenvModule>(envAdapter.name, "dotenv");
		const env = loadEnv(parser, opts);
		return createConfig(env, opts);
	},
});

export default envAdapter;
