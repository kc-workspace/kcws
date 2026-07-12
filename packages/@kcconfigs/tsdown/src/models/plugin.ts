import type { ConfigPlugin } from "@kcinternals/config-builder";
import type { TsdownConfig } from "./config";

export type TsdownPlugin<N extends string> = ConfigPlugin<N, TsdownConfig>;
