import { describe, expect, test } from "vitest";
import { baseProjectConfig } from "../constants/config";
import projectPlugin from "./project";

describe("projectPlugin", () => {
	test("should return plugin named 'project'", () => {
		const plugin = projectPlugin();
		expect(plugin.name).toBe("project");
	});

	test("should have configPriority of -1000", () => {
		const plugin = projectPlugin();
		expect(plugin.configPriority).toBe(-1000);
	});

	test("should merge baseProjectConfig into empty config", () => {
		const plugin = projectPlugin();
		const result = plugin.applyConfig?.({});
		expect(result).toMatchObject(baseProjectConfig);
	});
});
