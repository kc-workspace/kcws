import { describe, expect, test } from "vitest";
import publintPlugin from "./publint";

describe("publintPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = publintPlugin(true);
		expect(plugin.name).toBe("publint");
	});

	test("should apply publint config when true", () => {
		const plugin = publintPlugin(true);
		const base = { publint: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.publint).toBe(true);
	});

	test("should apply publint config when false", () => {
		const plugin = publintPlugin(false);
		const base = { publint: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.publint).toBe(false);
	});

	test("should apply publint config with object options", () => {
		const publintConfig = { level: "error" as const };
		const plugin = publintPlugin(publintConfig);
		const base = { publint: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.publint).toEqual(publintConfig);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = publintPlugin(true);
		const base = { entry: ["./src/index.ts"], publint: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.publint).toBe(true);
	});
});
