import type { ZodType, z } from "zod";
import deepMerge from "../utils/deepMerge";
import { ZconfigAdapterError, ZconfigValidationError } from "../utils/errors";
import type { Adapter, RawConfig } from "../utils/types";
import validateSchema from "./validateSchema";

/**
 * Normalises anything an adapter throws into a {@link ZconfigAdapterError}.
 *
 * An adapter that already reported a typed failure — a missing file, an absent
 * format library — is passed through untouched so its message survives. Every
 * other value is wrapped, so no raw error ever escapes this package.
 */
const asAdapterError = (adapter: Adapter, cause: unknown): unknown => {
	if (cause instanceof ZconfigAdapterError) return cause;

	const detail = cause instanceof Error ? cause.message : String(cause);
	return new ZconfigAdapterError(adapter.name, detail, cause);
};

/** Merges the collected sources and validates them against the schema. */
const validate = <S extends ZodType>(
	schema: S,
	sources: RawConfig[],
): z.output<S> => {
	const result = schema.safeParse(deepMerge(...sources));
	if (!result.success) throw new ZconfigValidationError(result.error);

	return result.data;
};

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
export const loadConfig = async <S extends ZodType>(
	schema: S,
	adapters: Adapter[],
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

	return validate(schema, sources);
};

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
export const loadConfigSync = <S extends ZodType>(
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

	return validate(schema, sources);
};
