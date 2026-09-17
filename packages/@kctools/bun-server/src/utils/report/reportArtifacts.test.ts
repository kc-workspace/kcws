import { describe, expect, test } from "vitest";
import reportArtifacts from "./reportArtifacts";
import type { ReportedFile } from "./types";

const file = (path: string, kind: string, size = 1024): ReportedFile => ({
	path,
	size,
	kind,
});

const report = (artifacts: ReportedFile[]): string[] =>
	Array.from(reportArtifacts("/repo", artifacts));

const paths = (rows: string[]): string[] =>
	rows.map((row) => row.split(" ")[0] ?? "");

describe("reportArtifacts", () => {
	test("reports the path, size and kind of an artifact", () => {
		expect(report([file("/repo/dist/index.js", "entry-point")])).toEqual([
			"dist/index.js  1.00 KB  entry",
		]);
	});

	test.each([
		{
			name: "entry points before other kinds",
			artifacts: [
				file("/repo/dist/chunk.js", "chunk"),
				file("/repo/dist/index.js", "entry-point"),
			],
			expected: ["dist/index.js", "dist/chunk.js"],
		},
		{
			name: "alphabetically inside a kind",
			artifacts: [
				file("/repo/dist/b.js", "chunk"),
				file("/repo/dist/a.js", "chunk"),
			],
			expected: ["dist/a.js", "dist/b.js"],
		},
		{
			name: "unknown kinds last",
			artifacts: [
				file("/repo/dist/unknown.js", "something-else"),
				file("/repo/dist/static.txt", "static"),
			],
			expected: ["dist/static.txt", "dist/unknown.js"],
		},
	])("orders $name", ({ artifacts, expected }) => {
		expect(paths(report(artifacts))).toEqual(expected);
	});

	test("pads the path column and right aligns the size column", () => {
		const rows = report([
			file("/repo/dist/a.js", "chunk", 1),
			file("/repo/dist/long-name.js", "chunk", 1024),
		]);

		expect(rows).toEqual([
			"dist/a.js              1 B  chunk",
			"dist/long-name.js  1.00 KB  chunk",
		]);
	});

	test("reports nothing when there is no artifact", () => {
		expect(report([])).toEqual([]);
	});
});
