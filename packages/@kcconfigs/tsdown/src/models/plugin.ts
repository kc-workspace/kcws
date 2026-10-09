import type { SyncConfigPlugin } from "@kcinternals/config-builder";
import type { TsdownConfig } from "./config";

export type TsdownConfigPlugin<N extends string> = SyncConfigPlugin<
	N,
	TsdownConfig
>;

export type AnyTsdownConfigPlugin = TsdownConfigPlugin<string>;
