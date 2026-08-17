import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, describe, expect, test } from "vitest";

/**
 * Guards the test harness itself: every adapter test depends on `node:fs` and
 * `node:fs/promises` being backed by memfs, and on `vol.reset()` isolating one
 * test from the next.
 */
describe("filesystem mock harness", () => {
	afterEach(() => vol.reset());

	test("should read a file written to the in-memory volume", () => {
		vol.fromJSON({ "/app/config.json": '{"debug":true}' });

		expect(readFileSync("/app/config.json", "utf8")).toBe('{"debug":true}');
	});

	test("should back node:fs/promises with the same volume", async () => {
		vol.fromJSON({ "/app/config.yaml": "debug: true" });

		await expect(readFile("/app/config.yaml", "utf8")).resolves.toBe(
			"debug: true",
		);
	});

	test("should not leak files between tests", () => {
		expect(existsSync("/app/config.json")).toBe(false);
		expect(existsSync("/app/config.yaml")).toBe(false);
	});

	test("should leave the real working directory untouched", () => {
		vol.fromJSON({ "/app/config.json": "{}" });

		// package.json genuinely exists on disk, so a passing assertion here
		// proves the mock volume is in play rather than the real filesystem.
		expect(existsSync(`${process.cwd()}/package.json`)).toBe(false);
	});
});
