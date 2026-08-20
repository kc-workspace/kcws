/**
 * A configuration object as produced by an adapter, before schema validation.
 *
 * Values are intentionally `unknown` — adapters never coerce, so a value is
 * whatever its source format yielded. Environment values are always strings.
 */
export type RawConfig = Record<string, unknown>;

/** A single leaf value visited during a {@link TransformFn} walk. */
export interface TransformInput {
	/** Full path to the value, e.g. `["database", "host"]`. */
	key: string[];
	/** Value read from the adapter source before schema validation. */
	value: unknown;
}

/** The relocated key and value a {@link TransformFn} chose to emit. */
export interface TransformOutput {
	/** Destination path for the transformed value. */
	key: string[];
	/** Value emitted at the destination path. */
	value: unknown;
}

/**
 * Rewrites a single leaf of an adapter's parsed output.
 *
 * Called once per leaf, after the adapter has parsed its source into a nested
 * structure and applied any adapter-specific key mapping. Returning `undefined`
 * drops the key entirely. If two transformed keys resolve to the same path, the
 * later one wins.
 */
export type TransformFn = (
	input: TransformInput,
) => TransformOutput | undefined;

/**
 * A configuration source.
 *
 * Adapters are ordered by the caller; later adapters override earlier ones
 * during the merge. Both entry points must be implemented so a single adapter
 * can serve `loadConfig` and `loadConfigSync` alike.
 */
export interface Adapter {
	/** Stable identifier used in {@link ZconfigAdapterError}, e.g. `"env"`. */
	readonly name: string;

	/** Loads and parses configuration asynchronously. */
	load(): Promise<RawConfig>;
	/** Loads and parses configuration synchronously. */
	loadSync(): RawConfig;
}

/** Options every adapter accepts. */
export interface BaseAdapterOptions {
	/** Transformation function applied to each leaf of the configuration. */
	transform?: TransformFn;
}
