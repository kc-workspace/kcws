import type {
	ExtendFileAdapterOptions,
	NormalizeFileAdapterOptions,
} from "../file";

/** Options for {@link autoAdapter}. */
export interface AutoAdapterOptions extends ExtendFileAdapterOptions {}

/** Normalized options used internally by the auto adapter. */
export type AutoAdapterNormalizedOptions =
	NormalizeFileAdapterOptions<AutoAdapterOptions>;
