import { describe, expect, test } from "vitest";
import { defaultIgnoreEntry } from "../constants";
import entryPlugin from "./entry";

describe("entryPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = entryPlugin(["./src/index.ts"]);
		expect(plugin.name).toBe("entry");
	});

	test("should set entry to the given string array", () => {
		const plugin = entryPlugin(["./src/index.ts", "./src/cli.ts"]);
		const base = { entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual([
			"./src/index.ts",
			"./src/cli.ts",
			...defaultIgnoreEntry,
		]);
	});

	test("should override existing entry", () => {
		const plugin = entryPlugin(["./src/other.ts"]);
		const base = { entry: ["./src/index.ts"] };
		const result = plugin.applyConfig?.(base);
		expect(result?.entry).toEqual(["./src/other.ts", ...defaultIgnoreEntry]);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = entryPlugin(["./src/index.ts"]);
		const base = { outDir: "dist", entry: undefined };
		const result = plugin.applyConfig?.(base);
		expect(result?.outDir).toBe("dist");
		expect(result?.entry).toEqual(["./src/index.ts", ...defaultIgnoreEntry]);
	});
});
