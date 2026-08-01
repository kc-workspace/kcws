import { format } from "node:util";
import type { AnyConfigPlugin, BaseConfig } from "../models";
import defineBaseConfig from "./defineBaseConfig";
import { withEnabled } from "./enabled";

const defineConfig = <C>(base: C, ...plugins: AnyConfigPlugin<C>[]): C => {
	const config = defineBaseConfig(base);

	const debug = ({ setting }: BaseConfig<C>, msg: string) =>
		withEnabled(setting?.debug, console.debug.bind(console))?.(msg);
	const verbose = ({ setting }: BaseConfig<C>, msg: string) =>
		withEnabled(setting?.verbose, console.debug.bind(console))?.(msg);

	const sortedPlugins = plugins.sort((a, b) => b.priority - a.priority);
	const applied = sortedPlugins.reduce((acc, plugin) => {
		const name = plugin.name;
		debug(acc, `applying plugin: ${name} (${plugin.priority})`);
		const before = acc;
		const after = plugin.apply(before);
		verbose(acc, format(`[%s] before: %O`, name, before));
		verbose(acc, format(`[%s] after: %O`, name, after));

		return after;
	}, config);

	debug(applied, format("all plugins applied: %O", applied));
	return applied.config;
};

export default defineConfig;
