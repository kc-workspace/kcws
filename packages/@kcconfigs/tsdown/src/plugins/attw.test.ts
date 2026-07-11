import { describe, expect, test } from "vitest";
import attwPlugin from "./attw";

describe("attwPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = attwPlugin(true);
		expect(plugin.name).toBe("attw");
	});

	test("should apply attw config when true", () => {
		const plugin = attwPlugin(true);
		const base = { attw: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.attw).toBe(true);
	});

	test("should apply attw config when false", () => {
		const plugin = attwPlugin(false);
		const base = { attw: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.attw).toBe(false);
	});

	test("should apply attw config with object options", () => {
		const attwConfig = { enabled: true, profile: "node16" as const };
		const plugin = attwPlugin(attwConfig);
		const base = { attw: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.attw).toEqual(attwConfig);
	});

	test("should apply attw with CIOption string", () => {
		const plugin = attwPlugin("ci-only" as const);
		const base = { attw: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.attw).toBe("ci-only");
	});

	test("should preserve existing base config when applying", () => {
		const plugin = attwPlugin(true);
		const base = { entry: ["./src/index.ts"], attw: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.attw).toBe(true);
	});
});
