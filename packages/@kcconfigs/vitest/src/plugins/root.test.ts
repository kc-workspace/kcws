import { describe, expect, test } from "vitest";
import { baseRootConfig } from "../constants/config";
import rootPlugin from "./root";

describe("rootPlugin", () => {
	test("should return plugin named 'root'", () => {
		const plugin = rootPlugin();
		expect(plugin.name).toBe("root");
	});

	test("should have configPriority of -1000", () => {
		const plugin = rootPlugin();
		expect(plugin.configPriority).toBe(-1000);
	});

	test("should merge baseRootConfig into empty config", () => {
		const plugin = rootPlugin();
		const result = plugin.applyConfig?.({});
		expect(result).toMatchObject(baseRootConfig);
	});
});
