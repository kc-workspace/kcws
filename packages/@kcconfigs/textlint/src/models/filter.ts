import type { AnyObject, BaseObject, UserBase, WithEnabled } from "./base";

export interface Filter<N extends string, C extends AnyObject>
	extends BaseObject<"filter", N> {
	config: WithEnabled<C>;
}

export type AnyFilter = Filter<string, AnyObject>;

export type UserFilter<
	RS extends AnyFilter[],
	K extends keyof AnyFilter,
> = UserBase<RS, "filter", K>;
