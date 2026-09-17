import { describe, expect, test } from "vitest";
import createLogger from "./createLogger";
import logger from "./logger";

describe("createLogger", () => {
	test("binds the given name", () => {
		expect(createLogger("utils/test").bindings()).toMatchObject({
			name: "utils/test",
		});
	});

	test("creates a child of the shared logger", () => {
		expect(createLogger("utils/test").level).toBe(logger.level);
	});

	test("keeps each logger name separate", () => {
		expect(createLogger("one").bindings()["name"]).not.toBe(
			createLogger("two").bindings()["name"],
		);
	});
});
