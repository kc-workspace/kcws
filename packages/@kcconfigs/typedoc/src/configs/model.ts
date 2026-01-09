import type { EnumKeys, ReflectionKind, TypeDocOptions } from "typedoc";

// biome-ignore lint/suspicious/noExplicitAny: any object type
export type AnyObject = Record<string, any>;
// biome-ignore lint/suspicious/noExplicitAny: any array type
export type AnyArray = any[];

export type Intersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

export type UserConfig = TypeDocOptions;

export type CustomConfig<C> = C extends UserConfig
	? {
			[K in Exclude<keyof C, keyof UserConfig>]?: C[K];
		}
	: never;

export type PluginConfig<C = NonNullable<unknown>> = UserConfig &
	CustomConfig<C>;
export type ThemeConfig<C = NonNullable<unknown>> = UserConfig &
	CustomConfig<C>;

export type ReflectionKinds = EnumKeys<typeof ReflectionKind>;

export type SortKinds = Exclude<TypeDocOptions["sort"], undefined>[number];
