import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { describe, expect, test } from "vitest";
import type { CommitlintConfig, TypeMode, TypeObject } from "../types";
import typesPlugin from "./types";

const readTypeRule = (config: CommitlintConfig | undefined) => {
	const rule = config?.rules?.["type-enum"] as [number, string, string[]];
	return rule;
};

const getTypes = (mode: TypeMode): TypeObject =>
	typesPlugin(mode).applyConfig?.({})?.prompt?.questions?.type
		?.enum as TypeObject;

describe("types resolution", () => {
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

describe("typesPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = typesPlugin();
		expect(plugin.name).toBe("types");
	});

	test("should configure standard types by default", () => {
		const plugin = typesPlugin();
		const result = plugin.applyConfig?.({});
		const [severity, condition, types] = readTypeRule(result);
		expect(severity).toBe(Severity.Error);
		expect(condition).toBe("always");
		expect(types.sort()).toEqual(
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
	});

	test("should expose type metadata to the prompt", () => {
		const plugin = typesPlugin();
		const result = plugin.applyConfig?.({});
		const typeEnum = result?.prompt?.questions?.type?.enum;
		expect(typeEnum?.["feat"]).toEqual({
			description: "A new feature",
			title: "Features",
			emoji: "✨",
		});
	});

	test("should configure minimal types", () => {
		const plugin = typesPlugin("minimal");
		const result = plugin.applyConfig?.({});
		const [, , types] = readTypeRule(result);
		expect(types.sort()).toEqual(["feat", "perf", "fix", "chore"].sort());
	});

	test("should configure custom types array", () => {
		const plugin = typesPlugin(["custom1", "custom2"]);
		const result = plugin.applyConfig?.({});
		const [, , types] = readTypeRule(result);
		expect(types.sort()).toEqual(["custom1", "custom2"].sort());
		expect(result?.prompt?.questions?.type?.enum).toEqual({
			custom1: {},
			custom2: {},
		});
	});

	test("should configure custom types object", () => {
		const plugin = typesPlugin({ type1: { description: "Type 1" } });
		const result = plugin.applyConfig?.({});
		const [, , types] = readTypeRule(result);
		expect(types).toEqual(["type1"]);
		expect(result?.prompt?.questions?.type?.enum?.["type1"]).toEqual({
			description: "Type 1",
		});
	});

	test("should replace types configured by an earlier plugin", () => {
		const first = typesPlugin("standard").applyConfig?.({}) ?? {};
		const result = typesPlugin(["only"]).applyConfig?.(first);
		const [, , types] = readTypeRule(result);
		expect(types).toEqual(["only"]);
		expect(Object.keys(result?.prompt?.questions?.type?.enum ?? {})).toEqual([
			"only",
		]);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = typesPlugin("minimal");
		const result = plugin.applyConfig?.({
			helpUrl: "help",
			rules: { "subject-max-length": [Severity.Warning, "always", 80] },
			prompt: {
				questions: { scope: { enum: { core: {} } } },
				settings: { enableMultipleScopes: false },
			},
		});
		expect(result?.helpUrl).toBe("help");
		expect(result?.rules?.["subject-max-length"]).toEqual([
			Severity.Warning,
			"always",
			80,
		]);
		expect(result?.prompt?.questions?.scope?.enum).toEqual({ core: {} });
		expect(result?.prompt?.settings?.enableMultipleScopes).toBe(false);
	});
});
