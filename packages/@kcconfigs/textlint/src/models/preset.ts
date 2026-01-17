import type { BaseObject } from "./base";
import type { AnyRule, UserRule } from "./rule";

export interface Preset<N extends string, RS extends AnyRule[]>
	extends BaseObject<"preset", N> {
	rules: UserRule<RS, "module">;
	rulesConfig: UserRule<RS, "config">;
}
export type AnyPreset = Preset<string, AnyRule[]>;

export type UserPreset<RS extends AnyPreset[]> = RS[number]["rulesConfig"];
