import type { AnyRule, AnyRuleFilters, AnyRuleRules, ToRuleMap } from "./rule";

// type RulesKeyByType<R extends Rules, T extends RuleType> = {
// 	[K in keyof R]: R[K] extends Rule<T, RuleConfig>
// 		? K extends string
// 			? K
// 			: never
// 		: never;
// }[keyof R];

// export type UserConfigRules<R extends Rules> = {
// 	[Key in RulesKeyByType<R, "rule">]: R[Key] extends { module: infer M }
// 		? M
// 		: never;
// };

// export type UserConfigConfig<R extends Rules, T extends RuleType> = {
// 	[Key in RulesKeyByType<R, T>]: R[Key]["config"];
// };

type UserConfigFilter<R extends AnyRuleFilters> = {
	[K in keyof R]: R[K]["config"];
};
type UserConfigRule<R extends AnyRuleRules> = {
	[K in keyof R]: R[K]["module"];
};
type UserConfigRuleConfig<R extends AnyRuleRules> = {
	[K in keyof R]: R[K]["config"];
};

export interface UserConfig<RS extends AnyRule[] = AnyRule[]> {
	filters: UserConfigFilter<ToRuleMap<RS, "filter">>;
	rules: UserConfigRule<ToRuleMap<RS, "rule">>;
	rulesConfig: UserConfigRuleConfig<ToRuleMap<RS, "rule">>;
}
