import type { BaseAdapterOptions } from "#types";

export type EnvObject = Record<string, string>;
export type DotenvFlag = boolean | string | string[];

// TODO: Add TSDoc to all properties here including default value
export interface EnvAdapterOptions extends BaseAdapterOptions {
	prefix?: string;
	pathSeparator: string;
	dotenv: DotenvFlag;
	customEnv: EnvObject | false;
	processEnv: EnvObject | false;
}

import type * as Dotenv from "dotenv";
export type DotenvModule = typeof Dotenv;
