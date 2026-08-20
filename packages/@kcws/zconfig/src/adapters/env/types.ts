import type { BaseAdapterOptions } from "#types";

/** Environment variables available to the environment adapter. */
export type EnvObject = Record<string, string>;

/** Options for {@link envAdapter}. */
export interface EnvAdapterOptions extends BaseAdapterOptions {
	/** Prefix required by environment variables; an underscore is appended when absent. */
	prefix?: string;
	/** Separator between nested configuration keys in environment variable names. @default `"__"` */
	pathSeparator: string;
	/** Environment values read to build the configuration. @default `process.env` */
	processEnv: EnvObject | false;
}
