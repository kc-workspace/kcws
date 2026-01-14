export type WithEnabled<T> = boolean | T;

export type RuleType = "filter" | "rule";

// biome-ignore lint/suspicious/noExplicitAny: config from third-party
export type RuleConfig = Record<string, any>;

// biome-ignore lint/suspicious/noExplicitAny: rule exported from third-party
export type RuleModule = any;

interface Rule<T extends RuleType, N extends string, C extends RuleConfig> {
	type: T;
	name: N;
	config: WithEnabled<C>;
}

export interface RuleRule<N extends string, C extends RuleConfig>
	extends Rule<"rule", N, C> {
	module: RuleModule;
}

export interface FilterRule<N extends string, C extends RuleConfig>
	extends Rule<"filter", N, C> {}

export type AnyRule = Rule<RuleType, string, RuleConfig>;

export type AnyRules = Record<string, AnyRule>;
export type AnyRuleRules = Record<string, RuleRule<string, RuleConfig>>;
export type AnyRuleFilters = Record<string, FilterRule<string, RuleConfig>>;

export type ToRuleMap<RS extends AnyRule[], T extends RuleType> = {
	[K in RS[number] as K extends Rule<T, infer N, RuleConfig>
		? N
		: never]: T extends "filter"
		? FilterRule<K["name"], Exclude<K["config"], boolean>>
		: T extends "rule"
			? RuleRule<K["name"], Exclude<K["config"], boolean>>
			: never;
};
