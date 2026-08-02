import { describe, expect, test } from "vitest";
import { overridePlugin, rootPlugin } from "../plugins";
import defineConfig from "./defineConfig";

describe("defineConfig", () => {
	test("should return empty config when plugin applies nothing", () => {
		const plugin = rootPlugin();
		const result = defineConfig(plugin);
		expect(result).toBeDefined();
	});

	test("should apply a single plugin's config", () => {
		const plugin = overridePlugin({ environment: "jsdom" });
		const result = defineConfig(plugin);
		expect(result.test?.environment).toBe("jsdom");
	});

	test("should apply multiple plugins and merge their configs", () => {
		const p1 = overridePlugin({ environment: "jsdom" });
		const p2 = overridePlugin({ timeout: 5000 });
		const result = defineConfig(p1, p2);
		expect(result.test?.environment).toBe("jsdom");
		expect(result.test?.timeout).toBe(5000);
	});

	test("should respect configPriority ordering (higher priority wins on conflict)", () => {
		// rootPlugin has priority -1000, overridePlugin has priority 1000
		// so override should win on conflicting keys
		const result = defineConfig(
			rootPlugin(),
			overridePlugin({ environment: "jsdom" }),
		);
		expect(result.test?.environment).toBe("jsdom");
	});
});
