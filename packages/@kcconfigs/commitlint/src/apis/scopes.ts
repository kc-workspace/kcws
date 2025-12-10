import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd as wd } from "node:process";
import { findBunPackages, findNpmPackages, findPnpmPackages } from "./projects";

/**
 * Automatically detects and retrieves project scopes based on the package manager in use.
 *
 * Determines the package manager by checking for workspace configuration files:
 * - pnpm: Checks for pnpm-workspace.yaml
 * - bun: Checks for bun.lock or bun.lockb
 * - npm: Falls back to npm package detection
 *
 * @param includeRoot - Whether to include the root package in the results
 * @returns Array of detected project scope names
 */
const getAutoScope = (includeRoot: boolean) => {
	const cwd = wd();

	if (existsSync(join(cwd, "pnpm-workspace.yaml"))) {
		return findPnpmPackages(includeRoot);
	} else if (
		existsSync(join(cwd, "bun.lock")) ||
		existsSync(join(cwd, "bun.lockb"))
	) {
		return findBunPackages(includeRoot);
	}

	return findNpmPackages(includeRoot);
};

/**
 * Retrieves a merged list of commit scopes based on automatic detection and user input.
 *
 * Combines user-provided scopes with automatically detected project scopes.
 * If no scopes are provided, returns a default set of common scope categories.
 *
 * @param auto - Whether to automatically detect scopes from workspace packages
 * @param scopes - Optional user-provided scopes to include
 * @returns Merged array of all available scopes
 *
 */
export const getScopes = async (
	auto: boolean,
	scopes?: string[],
): Promise<string[]> => {
	const _scopes: string[] = [];

	if (scopes) _scopes.push(...scopes);
	if (auto) _scopes.push(...(await getAutoScope(false)));

	if (_scopes.length === 0) {
		_scopes.push("core", "config", "script", "deps", "deps-dev");
	}
	return _scopes;
};
