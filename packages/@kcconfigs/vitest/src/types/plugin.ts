import type { SyncConfigPlugin } from "@kcinternals/config-builder";

export type VitestConfigPlugin<N extends string, C> = SyncConfigPlugin<N, C>;

export type AnyVitestConfigPlugin<C> = VitestConfigPlugin<string, C>;
