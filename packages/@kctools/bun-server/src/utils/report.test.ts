import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test } from "vitest";
import {
	formatArtifacts,
	formatDuration,
	formatMessage,
	formatSize,
	formatSummary,
} from "./report";

const cwd = resolve("/project");

const artifact = (
	path: string,
	size: number,
	kind: BunType.BuildArtifact["kind"],
): BunType.BuildArtifact =>
	({ path: resolve(cwd, path), size, kind }) as BunType.BuildArtifact;

describe("formatSize", () => {
	test("keeps byte counts whole", () => {
		expect(formatSize(512)).toBe("512 B");
	});

	test("switches to kilobytes at the unit boundary", () => {
		expect(formatSize(1024)).toBe("1.00 KB");
	});

	test("rounds to two decimals", () => {
		expect(formatSize(1536)).toBe("1.50 KB");
	});

	test("uses megabytes and gigabytes for larger sizes", () => {
		expect(formatSize(1024 * 1024 * 2)).toBe("2.00 MB");
		expect(formatSize(1024 ** 3 * 3)).toBe("3.00 GB");
	});

	test("promotes a size that rounds up onto the next unit", () => {
		expect(formatSize(1024 * 1024 - 1)).toBe("1.00 MB");
	});

	test("caps at the largest known unit", () => {
		expect(formatSize(1024 ** 6)).toBe("1048576.00 TB");
	});

	test("reports zero for empty, negative, and non-finite sizes", () => {
		expect(formatSize(0)).toBe("0 B");
		expect(formatSize(-10)).toBe("0 B");
		expect(formatSize(Number.NaN)).toBe("0 B");
	});
});

describe("formatDuration", () => {
	test("rounds sub-second durations to whole milliseconds", () => {
		expect(formatDuration(231.4)).toBe("231ms");
	});

	test("switches to seconds at one second", () => {
		expect(formatDuration(1000)).toBe("1.00s");
		expect(formatDuration(1234)).toBe("1.23s");
	});

	test("reports zero for empty and non-finite durations", () => {
		expect(formatDuration(0)).toBe("0ms");
		expect(formatDuration(Number.NaN)).toBe("0ms");
	});
});

describe("formatArtifacts", () => {
	test("reports paths relative to the given directory", () => {
		const lines = formatArtifacts(
			[artifact("dist/index.html", 1024, "asset")],
			cwd,
		);
		expect(lines).toEqual(["  dist/index.html  1.00 KB  asset"]);
	});

	test("keeps an absolute path for an artifact outside the directory", () => {
		const outside = resolve("/elsewhere/index.html");
		const lines = formatArtifacts(
			[{ path: outside, size: 10, kind: "asset" } as BunType.BuildArtifact],
			cwd,
		);
		expect(lines).toEqual([`  ${outside}  10 B  asset`]);
	});

	test("keeps the absolute path for an artifact at the directory itself", () => {
		const lines = formatArtifacts(
			[{ path: cwd, size: 10, kind: "asset" } as BunType.BuildArtifact],
			cwd,
		);
		expect(lines).toEqual([`  ${cwd}  10 B  asset`]);
	});

	test("pads the path and size columns to the widest value", () => {
		const lines = formatArtifacts(
			[
				artifact("dist/a.js", 1024 * 1024, "chunk"),
				artifact("dist/long-name.js", 10, "chunk"),
			],
			cwd,
		);

		expect(lines).toEqual([
			"  dist/a.js          1.00 MB  chunk",
			"  dist/long-name.js     10 B  chunk",
		]);
	});

	test("orders entrypoints before chunks, assets, and sourcemaps", () => {
		const lines = formatArtifacts(
			[
				artifact("dist/index.html.map", 10, "sourcemap"),
				artifact("dist/style.css", 10, "asset"),
				artifact("dist/chunk.js", 10, "chunk"),
				artifact("dist/index.html", 10, "entry-point"),
			],
			cwd,
		);

		expect(lines.map((line) => line.trim().split(/\s{2,}/)[0])).toEqual([
			"dist/index.html",
			"dist/chunk.js",
			"dist/style.css",
			"dist/index.html.map",
		]);
	});

	test("orders artifacts of the same kind alphabetically", () => {
		const lines = formatArtifacts(
			[artifact("dist/b.js", 10, "chunk"), artifact("dist/a.js", 10, "chunk")],
			cwd,
		);

		expect(lines).toEqual([
			"  dist/a.js  10 B  chunk",
			"  dist/b.js  10 B  chunk",
		]);
	});

	test("shortens the entry-point kind to 'entry'", () => {
		const lines = formatArtifacts(
			[artifact("dist/index.html", 10, "entry-point")],
			cwd,
		);
		expect(lines[0]).toContain("entry");
		expect(lines[0]).not.toContain("entry-point");
	});

	test("reports an unknown kind verbatim and last", () => {
		const lines = formatArtifacts(
			[
				{
					path: resolve(cwd, "dist/unknown.bin"),
					size: 10,
					kind: "wasm",
				} as unknown as BunType.BuildArtifact,
				artifact("dist/index.html.map", 10, "sourcemap"),
			],
			cwd,
		);

		expect(lines).toEqual([
			"  dist/index.html.map  10 B  sourcemap",
			"  dist/unknown.bin     10 B  wasm",
		]);
	});

	test("returns no lines when nothing was built", () => {
		expect(formatArtifacts([], cwd)).toEqual([]);
	});
});

describe("formatSummary", () => {
	test("sums the artifact sizes", () => {
		const summary = formatSummary(
			[
				artifact("dist/a.js", 1024, "chunk"),
				artifact("dist/b.js", 1024, "chunk"),
			],
			500,
		);
		expect(summary).toBe("  2 files, 2.00 KB in 500ms");
	});

	test("uses the singular noun for a single file", () => {
		const summary = formatSummary([artifact("dist/a.js", 10, "chunk")], 5);
		expect(summary).toBe("  1 file, 10 B in 5ms");
	});

	test("reports an empty build", () => {
		expect(formatSummary([], 0)).toBe("  0 files, 0 B in 0ms");
	});
});

describe("formatMessage", () => {
	test("reports level, name, and message", () => {
		expect(
			formatMessage({
				level: "info",
				name: "BuildMessage",
				message: "processed",
				position: null,
			} as BunType.BuildOutput["logs"][number]),
		).toBe("info: BuildMessage - processed");
	});

	test("appends the source location when the message has one", () => {
		expect(
			formatMessage({
				level: "error",
				name: "BuildMessage",
				message: "broken",
				position: { file: "src/app.ts", line: 3, column: 1 },
			} as BunType.BuildOutput["logs"][number]),
		).toBe("error: BuildMessage - broken (src/app.ts:3:1)");
	});
});
