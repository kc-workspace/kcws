import { describe, expect, test } from "vitest";
import browserPlugin from "./browser";

describe("browserPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = browserPlugin();
		expect(plugin.name).toBe("browser");
	});

	test("should set platform to browser", () => {
		const plugin = browserPlugin();
		const base = { platform: undefined } as any;
		const result = plugin.apply?.(base, {});
		expect(result?.platform).toBe("browser");
	});

	test("should preserve existing base config when applying", () => {
		const plugin = browserPlugin();
		const base = {
			entry: ["./src/index.ts"],
			platform: undefined,
		} as any;
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.platform).toBe("browser");
	});
});
