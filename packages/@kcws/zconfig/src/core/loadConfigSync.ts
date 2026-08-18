import type { ZodType, z } from "zod";
import type { Adapter, RawConfig } from "../types";
import { deepMerge } from "../utils/deepMerge";
import { asAdapterError } from "../utils/errors";
import { validateConfig, validateSchema } from "../utils/validators";

/**
 * Synchronous counterpart to {@link loadConfig}.
 *
 * Produces an identical result for identical inputs; only the adapter entry
 * point differs.
 *
 * @param schema - schema describing the expected configuration
 * @param adapters - ordered sources, later entries overriding earlier ones
 * @throws {ZconfigSchemaError} when a schema key is not camelCase
 * @throws {ZconfigAdapterError} when an adapter cannot produce configuration
 * @throws {ZconfigValidationError} when the merged configuration is invalid
 */
const loadConfigSync = <S extends ZodType>(
	schema: S,
	adapters: Adapter[],
): z.output<S> => {
	validateSchema(schema);

	const sources: RawConfig[] = [];
	for (const adapter of adapters) {
		try {
			sources.push(adapter.loadSync());
		} catch (cause) {
			throw asAdapterError(adapter, cause);
		}
	}

	return validateConfig(schema, deepMerge(...sources));
};
export default loadConfigSync;
