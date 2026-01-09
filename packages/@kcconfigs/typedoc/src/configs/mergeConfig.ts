import { mergeObject } from "../utils/object";
import type { CustomConfig, Intersection, UserConfig } from "./model";

export const mergeConfig = <
	C extends UserConfig,
	CO extends (UserConfig | undefined)[] = C[],
>(
	base: C,
	...overrides: CO
): UserConfig & CustomConfig<Intersection<C & CO[number]>> => {
	const config = overrides.reduce<UserConfig>((acc, override) => {
		if (override === undefined) return acc;
		else return _mergeConfig(acc, override);
	}, base);
	return config as UserConfig & CustomConfig<Intersection<C & CO[number]>>;
};

const _mergeConfig = <C extends UserConfig, CO extends UserConfig = C>(
	base: C,
	config: CO,
): C & CO => {
	return mergeObject(base as C & CO, config as DeepPartial<C & CO>);
};
