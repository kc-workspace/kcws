import { describe, expect, test } from "vitest";
import { defineFilter } from "./defineFilter";

describe(defineFilter.name, () => {
	test("should add the filter type to the returned object", () => {
		expect(
			defineFilter({
				name: "comments",
				config: true,
			}),
		).toEqual({
			type: "filter",
			name: "comments",
			config: true,
		});
	});
});
