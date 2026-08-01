import type { ConfigPlugin } from "@kcinternals/config-builder";
import type { TsdownConfig } from "./config";

export type TsdownConfigPlugin<N extends string> = ConfigPlugin<
	N,
	TsdownConfig
>;

export type AnyTsdownConfigPlugin = TsdownConfigPlugin<string>;
