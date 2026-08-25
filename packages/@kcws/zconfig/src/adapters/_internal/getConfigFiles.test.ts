import { describe, expect, test } from "vitest";
import getConfigFiles from "./getConfigFiles";

describe(getConfigFiles.name, () => {
	test("returns base candidates without a config name", () => {
		expect(getConfigFiles(["json", "jsonc"], undefined)).toEqual([
			"config.json",
			"config.jsonc",
			".config.json",
			".config.jsonc",
		]);
	});

	test("returns named candidates before base candidates", () => {
		expect(getConfigFiles(["yaml"], "app")).toEqual([
			"app.config.yaml",
			".app.config.yaml",
			".app/config.yaml",
			"app/config.yaml",
			".config/app.yaml",
			"config/app.yaml",
			"config.yaml",
			".config.yaml",
		]);
	});
});
