import type { ExtendFileAdapterOptions } from "../file";

/** Options for {@link dotenvAdapter}. */
export interface DotenvAdapterOptions extends ExtendFileAdapterOptions {
	/** Prefix required by environment variable names; an underscore is appended when absent. */
	prefix?: string;
	/** Separator between nested configuration keys in environment variable names. @default `"__"` */
	pathSeparator?: string;
}

import type * as Dotenv from "dotenv";
export type DotenvModule = typeof Dotenv;
