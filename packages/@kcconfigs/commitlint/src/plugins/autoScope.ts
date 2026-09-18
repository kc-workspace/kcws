import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd as wd } from "node:process";
import { definePlugin } from "@kcinternals/config-builder";
import type { CommitlintConfigPlugin } from "../types";
import {
	findBunPackages,
	findNpmPackages,
	findPnpmPackages,
} from "../utils/projects";
import { applyScopes } from "../utils/scopes";

/**
 * Detects workspace package names based on the package manager in use.
 *
 * - pnpm: `pnpm-workspace.yaml` exists
 * - bun: `bun.lock` or `bun.lockb` exists
 * - npm: fallback, `workspaces` in `package.json`
 *
 * The root package is always excluded.
 */
const detectScopes = (): Promise<string[]> => {
	const cwd = wd();

	if (existsSync(join(cwd, "pnpm-workspace.yaml"))) {
		return findPnpmPackages(false);
	} else if (
		existsSync(join(cwd, "bun.lock")) ||
		existsSync(join(cwd, "bun.lockb"))
	) {
		return findBunPackages(false);
	}

	return findNpmPackages(false);
};

/**
 * Auto scope plugin — allows workspace packages detected in the current
 * directory plus any additional scopes.
 *
 * Scopes are resolved when the plugin is created, so the factory is
 * asynchronous. When nothing is detected and no additional scopes are given,
 * falls back to `core`, `config`, `script`, `deps`, `deps-dev`.
 *
 * @param additional - Extra scopes appended to the detected ones
 * @returns commitlint config plugin
 * @see scopePlugin to allow a fixed list of scopes instead
 */
const autoScopePlugin = async (
	additional: string[] = [],
): Promise<CommitlintConfigPlugin<"autoScope">> => {
	const scopes = [...additional, ...(await detectScopes())];
	return definePlugin("autoScope", {
		applyConfig: (base) => applyScopes(base, scopes),
	});
};
export default autoScopePlugin;
