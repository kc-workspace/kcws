import { format } from "node:util";
import type { Config, ConfigPluginAny, DefineOption } from "../models";

const defineConfig = <C>(
	base: Config<C>,
	plugins: ConfigPluginAny<C>[],
	option?: DefineOption,
): Config<C> => {
	const _option: DefineOption = {
		debug: option?.debug,
		verbose: option?.verbose,
	};

	const applied = plugins.reduce((acc, plugin) => {
		if (!plugin.apply) return acc;
		const name = plugin.name || "unknown";
		_option.debug?.(`Applying plugin: ${name}`);
		const before = acc;
		const after = plugin.apply(acc, _option);
		_option.verbose?.(format(`[%s] Before: %O`, name, before));
		_option.verbose?.(format(`[%s] After: %O`, name, after));
		return after;
	}, base);
	_option.debug?.(format("All plugins applied: %O", applied));

	const normalized = plugins.reduce((acc, plugin) => {
		if (!plugin.normalize) return acc;
		const name = plugin.name || "unknown";
		_option.debug?.(`Normalizing plugin: ${name}`);
		const before = acc;
		const after = plugin.normalize(acc, _option);
		_option.verbose?.(format(`[%s] Before: %O`, name, before));
		_option.verbose?.(format(`[%s] After: %O`, name, after));
		return after;
	}, applied);
	_option.debug?.(format("All plugins normalized: %O", normalized));
	return normalized;
};

export default defineConfig;
