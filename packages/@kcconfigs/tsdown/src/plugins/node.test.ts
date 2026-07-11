import { describe, expect, test } from "vitest";
import nodePlugin from "./node";

describe("nodePlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = nodePlugin();
		expect(plugin.name).toBe("node");
	});

	test("should set platform to node", () => {
		const plugin = nodePlugin();
		const base = { platform: undefined as string | undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.platform).toBe("node");
	});

	test("should preserve existing base config when applying", () => {
		const plugin = nodePlugin();
		const base = { entry: ["./src/index.ts"], platform: undefined as string | undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.platform).toBe("node");
	});
});
