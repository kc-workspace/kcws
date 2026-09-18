import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { describe, expect, test } from "vitest";
import type { CommitlintConfig } from "../types";
import mergeConfig from "./mergeConfig";

describe("mergeConfig", () => {
	test("should merge top-level keys", () => {
		const base: CommitlintConfig = { helpUrl: "base" };
		const result = mergeConfig(base, { parserPreset: "preset" });
		expect(result.helpUrl).toBe("base");
		expect(result.parserPreset).toBe("preset");
	});

	test("should deep merge nested objects", () => {
		const base: CommitlintConfig = {
			rules: { "type-enum": [Severity.Error, "always", ["feat"]] },
		};
		const result = mergeConfig(base, {
			rules: { "subject-max-length": [Severity.Warning, "always", 80] },
		});
		expect(result.rules).toEqual({
			"type-enum": [Severity.Error, "always", ["feat"]],
			"subject-max-length": [Severity.Warning, "always", 80],
		});
	});

	test("should replace arrays instead of concatenating", () => {
		const base: CommitlintConfig = {
			rules: { "type-enum": [Severity.Error, "always", ["feat", "fix"]] },
		};
		const result = mergeConfig(base, {
			rules: { "type-enum": [Severity.Error, "always", ["chore"]] },
		});
		expect(result.rules?.["type-enum"]).toEqual([
			Severity.Error,
			"always",
			["chore"],
		]);
	});

	test("should replace functions instead of merging", () => {
		const fn = () => [Severity.Error, "always", ["a"]] as const;
		const base: CommitlintConfig = {
			rules: { "scope-enum": () => [Severity.Error, "always", ["z"]] },
		};
		const result = mergeConfig(base, { rules: { "scope-enum": fn } });
		expect(result.rules?.["scope-enum"]).toBe(fn);
	});

	test("should ignore undefined overrides", () => {
		const base: CommitlintConfig = { helpUrl: "base" };
		const result = mergeConfig(base, undefined, { parserPreset: "preset" });
		expect(result).toEqual({ helpUrl: "base", parserPreset: "preset" });
	});

	test("should ignore undefined values inside overrides", () => {
		const base: CommitlintConfig = { helpUrl: "base", parserPreset: "p" };
		const result = mergeConfig(base, {
			helpUrl: undefined,
		} as unknown as CommitlintConfig);
		expect(result).toEqual({ helpUrl: "base", parserPreset: "p" });
	});

	test("should apply overrides left to right", () => {
		const base: CommitlintConfig = { helpUrl: "base" };
		const result = mergeConfig(
			base,
			{ helpUrl: "first" },
			{ helpUrl: "second" },
		);
		expect(result.helpUrl).toBe("second");
	});

	test("should not mutate base config", () => {
		const base: CommitlintConfig = {
			helpUrl: "base",
			prompt: { settings: { enableMultipleScopes: false } },
		};
		mergeConfig(base, {
			helpUrl: "changed",
			prompt: { settings: { enableMultipleScopes: true } },
		});
		expect(base.helpUrl).toBe("base");
		expect(base.prompt?.settings?.enableMultipleScopes).toBe(false);
	});
});
