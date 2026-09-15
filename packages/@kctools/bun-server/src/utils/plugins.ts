import { error, info } from "node:console";
import { resolve } from "node:path";
import type * as Bun from "bun";

/** File Bun reads its own configuration from. */
export const BUNFIG = "bunfig.toml";

/** The part of `bunfig.toml` that declares static server plugins. */
interface Bunfig {
	serve?: {
		static?: {
			plugins?: unknown;
		};
	};
}

/**
 * List the bundler plugins declared in `bunfig.toml`.
 *
 * `[serve.static] plugins` is the only place Bun's development server takes
 * plugins from, so reading the same key is what keeps `build` in step with
 * `dev` — including `bun-plugin-tailwind`, which is a plugin like any other.
 *
 * @param bun - Bun runtime namespace
 * @param cwd - directory holding the configuration file
 * @returns module names of the declared plugins, empty when there are none
 */
export const pluginNames = async (
	bun: typeof Bun,
	cwd: string,
): Promise<string[]> => {
	const file = bun.file(resolve(cwd, BUNFIG));
	if (!(await file.exists())) return [];

	let config: Bunfig;
	try {
		config = bun.TOML.parse(await file.text()) as Bunfig;
	} catch (e) {
		error(`Cannot read ${BUNFIG}: ${(e as Error).message}`);
		return [];
	}

	const plugins = config.serve?.static?.plugins;
	if (!Array.isArray(plugins)) return [];
	return plugins.filter((name): name is string => typeof name === "string");
};

/**
 * Report the plugins that process the website, staying silent when none do.
 *
 * @param names - module names of the active plugins
 */
export const reportPlugins = (names: string[]): void => {
	if (names.length === 0) return;
	info(`Plugins from ${BUNFIG}: ${names.join(", ")}`);
};

/** Resolve a plugin module name against `cwd`, falling back to the bare name. */
const specifier = (bun: typeof Bun, name: string, cwd: string): string => {
	try {
		return bun.resolveSync(name, cwd);
	} catch {
		return name;
	}
};

/**
 * Import the declared plugins so the bundler can run them.
 *
 * A plugin that cannot be loaded is reported and skipped: one broken entry
 * should not take the whole build down, and the bundler still has work to do
 * without it.
 *
 * @param bun - Bun runtime namespace
 * @param names - module names of the plugins to load
 * @param cwd - directory the module names are resolved against
 * @returns the loaded plugins, in declaration order
 */
export const loadPlugins = async (
	bun: typeof Bun,
	names: string[],
	cwd: string,
): Promise<Bun.BunPlugin[]> => {
	const plugins: Bun.BunPlugin[] = [];
	for (const name of names) {
		try {
			const module = await import(specifier(bun, name, cwd));
			plugins.push((module.default ?? module) as Bun.BunPlugin);
		} catch (e) {
			error(`Cannot load plugin ${name}: ${(e as Error).message}`);
		}
	}
	return plugins;
};
