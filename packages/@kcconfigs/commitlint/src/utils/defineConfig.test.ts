import { cwd } from "node:process";
import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import autoScopePlugin from "../plugins/autoScope";
import overridePlugin from "../plugins/override";
import scopePlugin from "../plugins/scope";
import typesPlugin from "../plugins/types";
import type { CommitlintConfig } from "../types";
import defineConfig from "./defineConfig";

const STANDARD = [
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
];

const readTypes = (config: CommitlintConfig) => {
	const rule = config.rules?.["type-enum"] as [number, string, string[]];
	return rule[2];
};

const readScopes = (config: CommitlintConfig) => {
	const rule = config.rules?.["scope-enum"] as () => [number, string, string[]];
	return rule()[2];
};

const singlePackage = () =>
	vol.fromJSON(
		{ "./package.json": JSON.stringify({ name: "test-workspace" }) },
		cwd(),
	);

const pnpmWorkspace = () =>
	vol.fromJSON(
		{
			"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
			"./packages/pkg-a/package.json": JSON.stringify({
				name: "@scope/pkg-a",
			}),
		},
		cwd(),
	);

describe("defineConfig", () => {
	afterEach(() => {
		vol.reset();
	});

	beforeEach(() => {
		vi.mocked(cwd).mockReturnValue("/mock/workspace");
	});

	describe("base config", () => {
		test("should return base config without plugins", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(config.helpUrl).toBe("use 'pnpm commit' to create commit instead");
			expect(config.parserPreset).toBe("@commitlint/config-conventional");
		});

		test("should configure subject-max-length rule", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(config.rules?.["subject-max-length"]).toEqual([
				Severity.Warning,
				"always",
				80,
			]);
		});

		test("should configure body-max-line-length rule", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(config.rules?.["body-max-line-length"]).toEqual([
				Severity.Warning,
				"always",
				300,
			]);
		});

		test("should disable multiple scopes in prompt settings", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(config.prompt?.settings?.enableMultipleScopes).toBe(false);
		});

		test("should define only package-specific rule overrides", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(Object.keys(config.rules ?? {})).toHaveLength(4);
		});

		test("should define only type and scope prompt questions", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(Object.keys(config.prompt?.questions ?? {})).toHaveLength(2);
		});

		test("should not leak plugins between calls", async () => {
			singlePackage();
			const custom = await defineConfig(typesPlugin(["only"]));
			const fresh = await defineConfig();
			expect(readTypes(custom)).toEqual(["only"]);
			expect(readTypes(fresh).sort()).toEqual(STANDARD.sort());
		});
	});

	describe("types", () => {
		test("should use standard types when no types plugin is given", async () => {
			singlePackage();
			const config = await defineConfig();
			expect(readTypes(config).sort()).toEqual(STANDARD.sort());
			expect(
				Object.keys(config.prompt?.questions?.type?.enum ?? {}).sort(),
			).toEqual(STANDARD.sort());
		});

		test("should use types from typesPlugin", async () => {
			singlePackage();
			const config = await defineConfig(typesPlugin("minimal"));
			expect(readTypes(config).sort()).toEqual(
				["feat", "perf", "fix", "chore"].sort(),
			);
		});
	});

	describe("scopes", () => {
		test("should auto-detect scopes when no scope plugin is given", async () => {
			pnpmWorkspace();
			const config = await defineConfig();
			expect(readScopes(config)).toEqual(["scope/pkg-a"]);
			expect(config.prompt?.questions?.scope?.enum).toEqual({
				"scope/pkg-a": {},
			});
		});

		test("should use fixed scopes from scopePlugin", async () => {
			pnpmWorkspace();
			const config = await defineConfig(scopePlugin(["api"]));
			expect(readScopes(config)).toEqual(["api"]);
		});

		test("should merge auto-detected and custom scopes", async () => {
			pnpmWorkspace();
			const config = await defineConfig(autoScopePlugin(["custom"]));
			expect(readScopes(config).sort()).toEqual(
				["custom", "scope/pkg-a"].sort(),
			);
		});

		test("should fall back to default scopes", async () => {
			singlePackage();
			const config = await defineConfig(scopePlugin([]));
			expect(readScopes(config).sort()).toEqual(
				["core", "config", "script", "deps", "deps-dev"].sort(),
			);
		});

		test("should work with bun workspace", async () => {
			vol.fromJSON(
				{
					"./bun.lock": "",
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);
			const config = await defineConfig();
			expect(readScopes(config)).toContain("scope/pkg-a");
		});
	});

	describe("plugins", () => {
		test("should accept sync and async plugins together", async () => {
			pnpmWorkspace();
			const config = await defineConfig(
				typesPlugin("minimal"),
				autoScopePlugin(["custom"]),
			);
			expect(readTypes(config).sort()).toEqual(
				["feat", "perf", "fix", "chore"].sort(),
			);
			expect(readScopes(config).sort()).toEqual(
				["custom", "scope/pkg-a"].sort(),
			);
		});

		test("should apply overridePlugin after built-in plugins", async () => {
			singlePackage();
			const config = await defineConfig(
				overridePlugin({
					helpUrl: "custom",
					rules: { "type-enum": [Severity.Disabled, "always", []] },
				}),
				typesPlugin("minimal"),
			);
			expect(config.helpUrl).toBe("custom");
			expect(config.rules?.["type-enum"]).toEqual([
				Severity.Disabled,
				"always",
				[],
			]);
		});
	});
});
