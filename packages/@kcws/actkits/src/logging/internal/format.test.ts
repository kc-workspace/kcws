import { describe, expect, test } from "vitest";

import { formatter } from "./format";

describe("formatter", () => {
	test.for([
		{
			name: "namespace and printf args",
			format: "hello %s",
			args: ["world"],
			namespace: "stm:action",
			expected: "[stm:action] hello world",
		},
		{
			name: "printf args and no namespace",
			format: "count=%d",
			args: [2],
			namespace: undefined,
			expected: "count=2",
		},
		{
			name: "no args and namespace",
			format: "plain message",
			args: [],
			namespace: "stm:parser",
			expected: "[stm:parser] plain message",
		},
		{
			name: "no args and no namespace",
			format: "plain message",
			args: [],
			namespace: undefined,
			expected: "plain message",
		},
	])("should format with $name", ({ format, args, namespace, expected }) => {
		expect(formatter(format, args, namespace)).toBe(expected);
	});
});
