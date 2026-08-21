import { describe, expect, test } from "vitest";
import tsPathsPlugin from "./tsPaths";

describe("tsPathsPlugin", () => {
	test("should return plugin named 'tsPaths'", () => {
		const plugin = tsPathsPlugin();

		expect(plugin.name).toBe("tsPaths");
	});

	test("should enable tsconfig paths resolution", () => {
		const plugin = tsPathsPlugin();
		const result = plugin.applyConfig?.({
			test: { environment: "node" },
		});

		expect(result?.resolve?.tsconfigPaths).toBe(true);
		expect(result?.test?.environment).toBe("node");
	});
});
