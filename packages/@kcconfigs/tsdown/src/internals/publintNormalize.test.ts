import { describe, expect, test } from "vitest";
import publintNormalize from "./publintNormalize";

describe("publintNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = publintNormalize();
		expect(plugin.name).toBe("publint");
	});

	test("should set default enabled=true with level warning when publint is undefined", () => {
		const plugin = publintNormalize();
		const config = { publint: undefined };
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: true, level: "warning" });
	});

	test("should set default enabled=true with level warning when publint is null", () => {
		const plugin = publintNormalize();
		const config = { publint: null } as unknown as {
			publint: undefined;
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: true, level: "warning" });
	});

	test("should preserve level warning when publint is true", () => {
		const plugin = publintNormalize();
		const config = { publint: true };
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: true, level: "warning" });
	});

	test("should set enabled=false when publint is false", () => {
		const plugin = publintNormalize();
		const config = { publint: false };
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: false });
	});

	test("should normalize string publint to enabled with level warning", () => {
		const plugin = publintNormalize();
		const config = { publint: "ci-only" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: "ci-only", level: "warning" });
	});

	test("should merge user options with defaults", () => {
		const plugin = publintNormalize();
		const config = {
			publint: { enabled: true, strict: true },
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({
			enabled: true,
			level: "warning",
			strict: true,
		});
	});

	test("should allow overriding level", () => {
		const plugin = publintNormalize();
		const config = {
			publint: { enabled: true, level: "error" as const },
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.publint).toEqual({ enabled: true, level: "error" });
	});

	test("should preserve other config properties", () => {
		const plugin = publintNormalize();
		const config = { entry: ["./src/index.ts"], publint: undefined };
		const result = plugin.normalize?.(config, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.publint).toEqual({ enabled: true, level: "warning" });
	});
});
