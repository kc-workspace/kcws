import type { ConfigPlugin } from "@kcinternals/config-builder";
import type { CommitlintConfig } from "./config";

/**
 * A config-builder plugin that produces a {@link CommitlintConfig}.
 *
 * @typeParam N - Plugin name literal.
 */
export type CommitlintConfigPlugin<N extends string> = ConfigPlugin<
	N,
	CommitlintConfig
>;

/**
 * A {@link CommitlintConfigPlugin} with any name.
 */
export type AnyCommitlintConfigPlugin = CommitlintConfigPlugin<string>;

/**
 * Plugin input accepted by {@link defineConfig}: a plugin or a promise of one,
 * so asynchronous factories such as `autoScopePlugin` can be passed directly.
 */
export type CommitlintConfigPluginInput =
	| AnyCommitlintConfigPlugin
	| Promise<AnyCommitlintConfigPlugin>;
