import { describe, expect, test } from "vitest";

import { formatter } from "./format";

describe("formatter", () => {
	test("should format with namespace and printf args", () => {
		const message = formatter("hello %s", ["world"], "stm:action");
		expect(message).toBe("[stm:action] hello world");
	});

	test("should format with printf args and no namespace", () => {
		const message = formatter("count=%d", [2]);
		expect(message).toBe("count=2");
	});

	test("should format without args and with namespace", () => {
		const message = formatter("plain message", [], "stm:parser");
		expect(message).toBe("[stm:parser] plain message");
	});

	test("should format without args and without namespace", () => {
		const message = formatter("plain message", []);
		expect(message).toBe("plain message");
	});
});
