import { defineConfig as _defineConfig } from "@kcinternals/config-builder";
import type { AnyVitestConfigPlugin } from "../models";

const defineConfig = <C>(
	plugin: AnyVitestConfigPlugin<C>,
	...plugins: AnyVitestConfigPlugin<C>[]
): C => {
	return _defineConfig({} as C, plugin, ...plugins) as C;
};
export default defineConfig;
