/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { describe, expect, test } from "vitest";
import type { AnyConfig, ProjectConfig, UserConfig } from "./models";

describe("Type Definitions", () => {
	test("should export UserConfig type", () => {
		const config: UserConfig = {
			test: {
				environment: "node",
			},
		};

		expect(config).toBeDefined();
	});

	test("should export ProjectConfig type", () => {
		const config: ProjectConfig = {
			test: {
				name: "test-project",
			},
		};

		expect(config).toBeDefined();
	});

	test("should export AnyConfig type", () => {
		const config: AnyConfig = {
			anyKey: "anyValue",
			nested: {
				deep: true,
			},
		};

		expect(config).toBeDefined();
		expect(config["anyKey"]).toBe("anyValue");
		expect(config["nested"]["deep"]).toBe(true);
	});
});
