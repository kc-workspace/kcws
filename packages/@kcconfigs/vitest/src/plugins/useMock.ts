import { existsSync } from "node:fs";
import { join } from "node:path";
import { definePlugin } from "@kcinternals/config-builder";
import type { AnyConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

export interface UseMockOption {
	root?: string;
	flags: {
		fs?: true;
		fsPromises?: true;
		process?: true;
		os?: true;
		console?: true;
	};
}
type UseMockFlagKey = keyof UseMockOption["flags"];

const resolvePath = (name: string, base: string) => {
	// import.meta.dirname is resolved to `dist` directory
	const path = join(base, "__mocks__", `${name}.ts`);

	if (existsSync(path)) return path;
	throw new Error(`Mock file for "${name}" not found at path: ${path}`);
};

const useMockPlugin = (
	opt: UseMockOption,
): VitestConfigPlugin<"use-mock", AnyConfig> => {
	const base = opt.root ?? join(import.meta.dirname, "..", "..");
	const keys = Object.keys(opt.flags) as UseMockFlagKey[];
	const setupFiles = keys.map((key) => resolvePath(key, base));

	return definePlugin("use-mock", {
		applyConfig: (base) =>
			mergeConfig(base, {
				test: {
					setupFiles,
				},
			}),
	});
};

export default useMockPlugin;
