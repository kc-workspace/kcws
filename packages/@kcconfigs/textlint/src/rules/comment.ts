import type { FilterRule } from "../models/rule";

export type CommentRule = FilterRule<"comments", Record<string, never>>;

export const comments = (enabled = true): CommentRule => {
	return {
		type: "filter",
		name: "comments",
		config: enabled,
	};
};
