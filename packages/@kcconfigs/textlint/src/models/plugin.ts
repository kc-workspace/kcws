import type { AnyObject, BaseObject, UserBase } from "./base";

export interface Plugin<N extends string, C extends AnyObject>
	extends BaseObject<"plugin", N> {
	config: C;
}

export type AnyPlugin = Plugin<string, AnyObject>;

export type UserPlugin<
	RS extends AnyPlugin[],
	K extends keyof AnyPlugin,
> = UserBase<RS, "plugin", K>;
