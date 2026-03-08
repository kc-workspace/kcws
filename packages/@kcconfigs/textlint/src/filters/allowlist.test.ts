import { describe, expect, test } from "vitest";
import { allowlist, DEFAULT_ALLOWLIST } from "./allowlist";

describe(allowlist.name, () => {
	test("should disable the filter when no config is provided", () => {
		expect(allowlist()).toEqual({
			type: "filter",
			name: "allowlist",
			config: false,
		});
	});

	test("should apply the default allow list when allow is omitted", () => {
		expect(
			allowlist({
				allowlistConfigPaths: ["./allowlist.txt"],
			}),
		).toEqual({
			type: "filter",
			name: "allowlist",
			config: {
				allow: DEFAULT_ALLOWLIST,
				allowlistConfigPaths: ["./allowlist.txt"],
			},
		});
	});

	test("should preserve an explicit allow list", () => {
		expect(
			allowlist({
				allow: ["bun", "pnpm"],
			}),
		).toEqual({
			type: "filter",
			name: "allowlist",
			config: {
				allow: ["bun", "pnpm"],
			},
		});
	});
});
