import type { Adapter } from "#types";
import { importAsync, importSync } from "#utils/imports";
import type { DotenvModule, EnvAdapterOptions } from "./types";
import { createConfig, loadEnv, normalizeOptions } from "./utils";

/**
 * Creates an adapter that reads configuration values from environment
 * variables, an optional dotenv file, and optional custom values.
 *
 * Values are loaded in this order: `customEnv`, dotenv, then `processEnv`.
 * Later sources override earlier sources. Environment variable names are
 * decoded into nested camelCase keys using `prefix` and `pathSeparator`.
 *
 * @param options - environment variable sources and key decoding options
 * @returns adapter suitable for {@link loadConfig} and {@link loadConfigSync}
 * @throws {ZconfigAdapterError} when a required dotenv file cannot be loaded
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
