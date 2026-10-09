import type { BaseSetting } from "./setting";

export interface BaseConfig<C> {
	readonly setting: BaseSetting;
	/** The configuration data */
	readonly config: C;
}

// biome-ignore lint/suspicious/noExplicitAny: AnyBaseConfig should use any type
export type AnyBaseConfig = BaseConfig<any>;

export type GetConfig<B extends AnyBaseConfig> =
	B extends BaseConfig<infer C> ? C : never;
