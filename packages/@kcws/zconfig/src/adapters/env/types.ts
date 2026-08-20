import type { BaseAdapterOptions } from "#types";

/** Environment variables available to the environment adapter. */
export type EnvObject = Record<string, string>;

/** Sources supported by the environment adapter's dotenv option. */
export type DotenvFlag = boolean | string | string[];

/** Options for {@link envAdapter}. */
export interface EnvAdapterOptions extends BaseAdapterOptions {
	/** Prefix required by environment variables; an underscore is appended when absent. */
	prefix?: string;
	/** Separator between nested configuration keys in environment variable names. @default `"__"` */
	pathSeparator: string;
	/** Dotenv source: `true` loads optional `.env`, a string loads a required path, and `false` disables dotenv loading. @default `true` */
	dotenv: DotenvFlag;
	/** Additional environment values loaded before dotenv and process values. @default `false` */
	customEnv: EnvObject | false;
	/** Environment values loaded last and used with highest precedence. @default `process.env` */
	processEnv: EnvObject | false;
}

import type * as Dotenv from "dotenv";
export type DotenvModule = typeof Dotenv;
