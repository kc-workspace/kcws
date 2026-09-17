import { afterEach, describe, expect, test, vi } from "vitest";
import type { Logger } from "./types";

const importLogger = async (debug: string | undefined): Promise<Logger> => {
	vi.stubEnv("DEBUG", debug);
	vi.resetModules();
	const module = await import("./logger");
	return module.default;
};

afterEach(() => {
	vi.resetModules();
});

describe("logger", () => {
	test.each([
		{ name: "DEBUG is unset", debug: undefined, level: "info" },
		{ name: "DEBUG is disabled", debug: "false", level: "info" },
		{ name: "DEBUG is enabled", debug: "true", level: "debug" },
	])("logs from the $level level when $name", async ({ debug, level }) => {
		await expect(importLogger(debug)).resolves.toMatchObject({ level });
	});
});
