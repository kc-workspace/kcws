import { debug } from "node:console";
import { describe, expect, test } from "vitest";
import { defineConfig } from ".";

describe(defineConfig.name, () => {
	test("should define config correctly", () => {
		// Example test for defineConfig
		const base = { key: "value" };
		const plugin = {
			name: "testPlugin",
			apply: (config: typeof base) => ({ ...config, added: true }),
		};
		const result = defineConfig(base, [plugin]);
		expect(result).toEqual({ key: "value", added: true });
	});

	test("should write debug log when provides", () => {
		// Example test for defineConfig
		const base = { key: "value" };
		const plugins = [
			{
				name: "testPlugin",
				apply: (config: typeof base) => ({ key: `new ${config.key}` }),
			},
			{
				name: "",
				apply: (config: typeof base) => ({ ...config, value: true }),
			},
		];
		const result = defineConfig(base, plugins, { debug });
		expect(result).toEqual({ key: "new value", value: true });

		expect(debug).toHaveBeenNthCalledWith(1, "Applying plugin: testPlugin");
		expect(debug).toHaveBeenNthCalledWith(2, "Applying plugin: unknown");
	});
});
