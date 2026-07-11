import type { ConfigPlugin } from "@kcconfigs/_builder";
import type { TsdownConfig } from "./config";

export type TsdownPlugin<N extends string> = ConfigPlugin<N, TsdownConfig>;
