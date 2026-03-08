import { describe, expect, test } from "vitest";
import { comments } from "./comment";

describe(comments.name, () => {
	test("should enable the filter by default", () => {
		expect(comments()).toEqual({
			type: "filter",
			name: "comments",
			config: true,
		});
	});

	test("should allow disabling the filter", () => {
		expect(comments(false)).toEqual({
			type: "filter",
			name: "comments",
			config: false,
		});
	});
});
