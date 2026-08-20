import type { ZodType, z } from "zod";
import { DEF_ADAPTERS } from "../constants";
import type { Adapter, RawConfig } from "../types";
import { deepMerge } from "../utils/deepMerge";
import { asAdapterError } from "../utils/errors";
import { validateConfig, validateSchema } from "../utils/validators";

/**
 * Loads configuration from every adapter, merges it, and validates the result.
 *
 * Adapters are applied in order and later ones win on conflict. Schema keys are
 * checked before any adapter runs, so an invalid schema fails without touching
 * the filesystem or the environment.
 *
 * Adapters run sequentially rather than concurrently. Order is observable —
 * `envAdapter` may populate `process.env` from a `.env` file — so overlapping
 * them would make the outcome depend on scheduling.
 *
 * @param schema - schema describing the expected configuration
 * @param adapters - ordered sources, later entries overriding earlier ones
 * @throws {ZconfigSchemaError} when a schema key is not camelCase
 * @throws {ZconfigAdapterError} when an adapter cannot produce configuration
 * @throws {ZconfigValidationError} when the merged configuration is invalid
 */
const loadConfig = async <S extends ZodType>(
	schema: S,
	adapters: Adapter[] = DEF_ADAPTERS,
): Promise<z.output<S>> => {
	validateSchema(schema);

	const sources: RawConfig[] = [];
	for (const adapter of adapters) {
		try {
			sources.push(await adapter.load());
		} catch (cause) {
			throw asAdapterError(adapter, cause);
		}
	}

	return validateConfig(schema, deepMerge(...sources));
};
export default loadConfig;
