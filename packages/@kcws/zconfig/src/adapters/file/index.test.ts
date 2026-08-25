import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { fileAdapter } from ".";

describe("fileAdapter", () => {
	afterEach(() => {
		vol.reset();
	});

	test("uses the synchronous parser as the asynchronous default", async () => {
		vol.fromJSON({ "config.custom": "debug=true" }, mockCwd);

		const adapter = fileAdapter({
			name: "custom",
			files: ["config.custom"],
			parseSync: <T>(content: string): T =>
				({ debug: content === "debug=true" }) as T,
		});

		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object for an explicit optional path that is missing", () => {
		const adapter = fileAdapter({
			name: "custom",
			files: [],
			path: "missing.custom",
			parseSync: <T>(): T => ({}) as T,
			optional: true,
		});

		expect(adapter.loadSync()).toEqual({});
	});

	test("wraps non-Error parser failures in a typed adapter error", () => {
		vol.fromJSON({ "config.custom": "invalid" }, mockCwd);

		const adapter = fileAdapter({
			name: "custom",
			files: ["config.custom"],
			parseSync: () => {
				throw "invalid configuration";
			},
		});

		expect(() => adapter.loadSync()).toThrow(ZconfigAdapterError);
	});
});
