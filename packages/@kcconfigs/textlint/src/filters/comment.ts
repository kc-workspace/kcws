import type { EmptyObject, Filter } from "../models";
import { defineFilter } from "../utils/defineFilter";

export type CommentRule = Filter<"comments", EmptyObject>;

export const comments = (enabled = true): CommentRule => {
	return defineFilter({
		name: "comments",
		config: enabled,
	});
};
