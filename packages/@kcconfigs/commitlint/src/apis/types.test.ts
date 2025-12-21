/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { describe, expect, test } from "vitest";
import { getTypes } from "./types";

describe("Types APIs", () => {
	describe(getTypes.name, () => {
		test("should return standard types when mode is 'standard'", () => {
			const types = getTypes("standard");

			expect(Object.keys(types).sort()).toEqual(
				[
					"feat",
					"perf",
					"fix",
					"docs",
					"test",
					"style",
					"build",
					"refactor",
					"ci",
					"chore",
					"revert",
				].sort(),
			);
			expect(types["feat"]).toEqual({
				description: "A new feature",
				title: "Features",
				emoji: "✨",
			});
		});

		test("should return minimal types when mode is 'minimal'", () => {
			const types = getTypes("minimal");

			expect(Object.keys(types).sort()).toEqual(
				["feat", "perf", "fix", "chore"].sort(),
			);
			expect(types["feat"]).toEqual({
				description: "A new feature",
				title: "Features",
				emoji: "✨",
			});
		});

		test("should return custom types when mode is an array", () => {
			const types = getTypes(["custom1", "custom2", "custom3"]);

			expect(Object.keys(types).sort()).toEqual(
				["custom1", "custom2", "custom3"].sort(),
			);
			expect(types["custom1"]).toEqual({});
			expect(types["custom2"]).toEqual({});
			expect(types["custom3"]).toEqual({});
		});

		test("should return custom types when mode is an object", () => {
			const customTypes = {
				type1: {
					description: "Custom type 1",
					title: "Type 1",
					emoji: "🎨",
				},
				type2: {
					description: "Custom type 2",
					title: "Type 2",
				},
			};

			const types = getTypes(customTypes);

			expect(types).toEqual(customTypes);
		});

		test("should handle empty array", () => {
			const types = getTypes([]);

			expect(types).toEqual({});
		});

		test("should handle single type in array", () => {
			const types = getTypes(["single"]);

			expect(Object.keys(types)).toEqual(["single"]);
			expect(types["single"]).toEqual({});
		});
	});
});
