import type { ConfigPlugin } from "@kcinternals/config-builder";

export type VitestConfigPlugin<N extends string, C> = ConfigPlugin<N, C>;

export type AnyVitestConfigPlugin<C> = VitestConfigPlugin<string, C>;
