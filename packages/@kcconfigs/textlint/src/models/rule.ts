import type { AnyObject, BaseObject, UserBase, WithEnabled } from "./base";

// biome-ignore lint/suspicious/noExplicitAny: rule module is third-party type
export type RuleModule = any;

export interface Rule<N extends string, C extends AnyObject>
	extends BaseObject<"rule", N> {
	module: RuleModule;
	config: WithEnabled<C>;
}

export type AnyRule = Rule<string, AnyObject>;

export type UserRule<RS extends AnyRule[], K extends keyof AnyRule> = UserBase<
	RS,
	"rule",
	K
>;
