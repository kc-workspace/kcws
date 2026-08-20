import { importSync } from "#utils/imports";
import type { EnvObject } from "../env/types";
import { decodeEnvObject } from "../env/utils";
import type { DotenvAdapterOptions, DotenvModule } from "./types";

/**
 * Parses dotenv file content into a decoded, nested configuration object.
 *
 * The flat result from the `dotenv` module is decoded with the same
 * prefix/pathSeparator key logic used by {@link envAdapter}. The caller's
 * transform is not applied here; {@link fileAdapter} applies it once on the
 * returned value.
 *
 * @param content - raw dotenv file content
 * @param options - prefix and path separator options
 * @returns decoded, nested configuration object
 */
export const decodeDotenv = <T>(
	content: string,
	options: DotenvAdapterOptions,
): T => {
	const mod = importSync<DotenvModule>("dotenv", "dotenv");
	const parsed = mod.parse(content) as EnvObject;
	return decodeEnvObject(
		parsed,
		options.prefix,
		options.pathSeparator ?? "__",
	) as T;
};
