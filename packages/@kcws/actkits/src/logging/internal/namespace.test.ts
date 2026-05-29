import { describe, expect, test } from "vitest";

import { createNamespace, NS_SEP } from "./namespace";

describe("namespace", () => {
	test("should expose colon separator", () => {
		expect(NS_SEP).toBe(":");
	});

	test("should join parent and child segments", () => {
		const result = createNamespace("stm", ["action-a", "http"]);
		expect(result).toBe("stm:action-a:http");
	});

	test("should drop empty segments", () => {
		const result = createNamespace("stm", ["", "action-a", "", "parser"]);
		expect(result).toBe("stm:action-a:parser");
	});

	test("should drop empty parent when parent is empty string", () => {
		const result = createNamespace("", ["stm", "http"]);
		expect(result).toBe("stm:http");
	});

	test("should safely ignore undefined-like segment values at runtime", () => {
		const runtimeSegments = [
			"action-a",
			undefined,
			"parser",
		] as unknown as string[];
		const result = createNamespace("stm", runtimeSegments);
		expect(result).toBe("stm:action-a:parser");
	});
});
