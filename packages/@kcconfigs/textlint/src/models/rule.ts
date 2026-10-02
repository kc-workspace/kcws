import type { AnyObject, BaseObject, UserBase, WithEnabled } from "./base";

export interface Rule<N extends string, C extends AnyObject>
	extends BaseObject<"rule", N> {
	// biome-ignore lint/suspicious/noExplicitAny: rule module is third-party type
	module: any;
	config: WithEnabled<C>;
}

export type AnyRule = Rule<string, AnyObject>;

export type UserRule<RS extends AnyRule[], K extends keyof AnyRule> = UserBase<
	RS,
	"rule",
	K
>;
