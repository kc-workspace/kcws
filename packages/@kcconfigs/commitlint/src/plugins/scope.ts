import { definePlugin } from "@kcinternals/config-builder";
import type { CommitlintConfigPlugin } from "../types";
import { applyScopes } from "../utils/scopes";

/**
 * Scope plugin — allows exactly the given scopes.
 *
 * Never reads the filesystem. An empty list falls back to
 * `core`, `config`, `script`, `deps`, `deps-dev`.
 *
 * @param scopes - Scopes to allow
 * @returns commitlint config plugin
 * @see autoScopePlugin to detect scopes from the workspace instead
 */
const scopePlugin = (scopes: string[]): CommitlintConfigPlugin<"scope"> =>
	definePlugin("scope", {
		applyConfig: (base) => applyScopes(base, scopes),
	});
export default scopePlugin;
