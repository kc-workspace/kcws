import { cwd } from "node:process";
import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { CommitlintConfig } from "../types";
import autoScopePlugin from "./autoScope";
import scopePlugin from "./scope";

const readScopes = (config: CommitlintConfig | undefined) => {
	const rule = config?.rules?.["scope-enum"] as () => [
		number,
		string,
		string[],
	];
	return rule();
};

const pkgA = JSON.stringify({ name: "@scope/pkg-a" });

describe("autoScopePlugin", () => {
	afterEach(() => {
		vol.reset();
	});

	beforeEach(() => {
		vi.mocked(cwd).mockReturnValue("/mock/workspace");
	});

	test("should have correct plugin name", async () => {
		vol.fromJSON({ "./package.json": "{}" }, cwd());
		const plugin = await autoScopePlugin();
		expect(plugin.name).toBe("autoScope");
	});

	test("should detect pnpm workspace packages", async () => {
		vol.fromJSON(
			{
				"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
				"./packages/pkg-a/package.json": pkgA,
				"./packages/pkg-b/package.json": JSON.stringify({
					name: "@scope/pkg-b",
				}),
			},
			cwd(),
		);
		const plugin = await autoScopePlugin();
		const [severity, condition, scopes] = readScopes(plugin.applyConfig?.({}));
		expect(severity).toBe(Severity.Error);
		expect(condition).toBe("always");
		expect(scopes.sort()).toEqual(["scope/pkg-a", "scope/pkg-b"].sort());
	});

	test("should detect bun workspace with bun.lock", async () => {
		vol.fromJSON(
			{
				"./bun.lock": "",
				"./package.json": JSON.stringify({ workspaces: ["packages/*"] }),
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const plugin = await autoScopePlugin();
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes).toEqual(["scope/pkg-a"]);
	});

	test("should detect bun workspace with bun.lockb", async () => {
		vol.fromJSON(
			{
				"./bun.lockb": "",
				"./package.json": JSON.stringify({ workspaces: ["packages/*"] }),
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const plugin = await autoScopePlugin();
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes).toEqual(["scope/pkg-a"]);
	});

	test("should fall back to npm workspaces", async () => {
		vol.fromJSON(
			{
				"./package.json": JSON.stringify({ workspaces: ["packages/*"] }),
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const plugin = await autoScopePlugin();
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes).toEqual(["scope/pkg-a"]);
	});

	test("should merge additional scopes with detected scopes", async () => {
		vol.fromJSON(
			{
				"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const plugin = await autoScopePlugin(["custom1", "custom2"]);
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes.sort()).toEqual(["custom1", "custom2", "scope/pkg-a"].sort());
	});

	test("should expose scopes to the prompt", async () => {
		vol.fromJSON(
			{
				"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const plugin = await autoScopePlugin(["custom"]);
		const result = plugin.applyConfig?.({});
		expect(result?.prompt?.questions?.scope?.enum).toEqual({
			custom: {},
			"scope/pkg-a": {},
		});
	});

	test("should fall back to default scopes when nothing is detected", async () => {
		vol.fromJSON(
			{ "./package.json": JSON.stringify({ name: "single" }) },
			cwd(),
		);
		const plugin = await autoScopePlugin();
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes.sort()).toEqual(
			["core", "config", "script", "deps", "deps-dev"].sort(),
		);
	});

	test("should replace scopes configured by scopePlugin", async () => {
		vol.fromJSON(
			{
				"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
				"./packages/pkg-a/package.json": pkgA,
			},
			cwd(),
		);
		const first = scopePlugin(["old"]).applyConfig?.({}) ?? {};
		const result = (await autoScopePlugin()).applyConfig?.(first);
		const [, , scopes] = readScopes(result);
		expect(scopes).toEqual(["scope/pkg-a"]);
		expect(result?.prompt?.questions?.scope?.enum).toEqual({
			"scope/pkg-a": {},
		});
	});

	test("should preserve existing base config when applying", async () => {
		vol.fromJSON(
			{ "./package.json": JSON.stringify({ name: "single" }) },
			cwd(),
		);
		const plugin = await autoScopePlugin(["api"]);
		const result = plugin.applyConfig?.({
			helpUrl: "help",
			rules: { "type-enum": [Severity.Error, "always", ["feat"]] },
			prompt: {
				questions: { type: { enum: { feat: {} } } },
				settings: { enableMultipleScopes: false },
			},
		});
		expect(result?.helpUrl).toBe("help");
		expect(result?.rules?.["type-enum"]).toEqual([
			Severity.Error,
			"always",
			["feat"],
		]);
		expect(result?.prompt?.questions?.type?.enum).toEqual({ feat: {} });
		expect(result?.prompt?.settings?.enableMultipleScopes).toBe(false);
	});
});
