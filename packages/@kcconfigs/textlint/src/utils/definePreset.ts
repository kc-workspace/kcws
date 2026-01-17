import type { AnyRule, Preset, UserRule } from "../models";

export const definePreset = <N extends string, RS extends AnyRule[]>(
	name: N,
	...inputs: RS
): Preset<N, RS> => {
	const preset = {
		type: "preset",
		name,
		rules: {},
		rulesConfig: {},
	} as Preset<N, RS>;

	for (const input of inputs) {
		type Key = keyof Preset<N, RS>["rules"];
		type Config = UserRule<RS, "config">[Key];
		preset.rules[input.name as Key] = input.module;
		preset.rulesConfig[input.name as Key] = input.config as Config;
	}

	return preset;
};
