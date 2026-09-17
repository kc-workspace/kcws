import { resolve } from "node:path";
import type { BunPlugin } from "bun";
import type { BunType } from "#types";
import { readOptions } from "#utils/options";
import { logger } from "./constants";

export const BUNFIG = "bunfig.toml";
// https://bun.com/docs/bundler/html-static#plugins
export interface Bunfig {
	serve?: {
		static?: {
			plugins: string[];
		};
	};
}

const readPlugins = async (
	Bun: BunType,
	option: AnyRecord,
): Promise<BunPlugin[]> => {
	const cwd = readOptions<string>(option, "cwd");
	const plugins: BunPlugin[] = [];
	const file = Bun.file(resolve(cwd, BUNFIG));
	if (!(await file.exists())) {
		logger.debug({ file: BUNFIG }, `load empty plugin because file is missing`);
		return plugins;
	}

	try {
		const toml: Bunfig = Bun.TOML.parse(await file.text());
		const pluginNames = toml.serve?.static?.plugins;
		if (!Array.isArray(pluginNames)) {
			logger.debug(
				{ file: BUNFIG },
				`load empty plugin because the plugins array is missing or invalid`,
			);
			return plugins;
		}
		logger.info(`Bun plugins: ${pluginNames.join(", ")}`);

		for (const plugin of pluginNames) {
			try {
				const pluginPath = await Bun.resolve(plugin, cwd);
				const module = await import(pluginPath);
				plugins.push(module.default ?? module);
			} catch (error) {
				logger.error({ error, plugin }, `Failed to load plugin: ${plugin}`);
			}
		}
		return plugins;
	} catch (error) {
		logger.error({ error }, "Failed to read plugins from bunfig.toml");
		return plugins;
	}
};

export default readPlugins;
