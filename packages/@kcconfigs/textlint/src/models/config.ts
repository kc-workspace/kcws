import type { AnyFilter } from "./filter";
import type { AnyPlugin } from "./plugin";
import type { AnyPreset, UserPreset } from "./preset";
import type { AnyRule, UserRule } from "./rule";

export interface Config<
	PL extends AnyPlugin[],
	PR extends AnyPreset[],
	RU extends AnyRule[],
	FL extends AnyFilter[],
> {
	plugins?: PL;
	presets?: PR;
	rules?: RU;
	filters?: FL;
}

export type AnyConfig = Config<
	AnyPlugin[],
	AnyPreset[],
	AnyRule[],
	AnyFilter[]
>;

type UserConfigRule<C extends AnyConfig> =
	NonNullable<C["presets"]> extends never[]
		? NonNullable<C["rules"]> extends never[]
			? Record<string, never>
			: UserRule<NonNullable<C["rules"]>, "config">
		: NonNullable<C["rules"]> extends never[]
			? UserPreset<NonNullable<C["presets"]>>
			: UserPreset<NonNullable<C["presets"]>> &
					UserRule<NonNullable<C["rules"]>, "config">;

export interface UserConfig<C extends AnyConfig> {
	plugins?: C["plugins"];
	filters?: C["filters"];
	rules?: UserConfigRule<C>;
}

export type AnyUserConfig = UserConfig<AnyConfig>;
