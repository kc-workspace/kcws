import { describe, expect, test } from "vitest";
import reportSummary from "./reportSummary";
import type { ReportedFile } from "./types";

const file = (size: number): ReportedFile => ({
	path: `/repo/dist/${size}.js`,
	size,
	kind: "chunk",
});

describe("reportSummary", () => {
	test("sums the size of every artifact", () => {
		expect(reportSummary(231, [file(1024), file(1024)])).toBe(
			"2 files, 2.00 KB in 231ms",
		);
	});

	test("uses the singular form for a single file", () => {
		expect(reportSummary(231, [file(10)])).toBe("1 file, 10 B in 231ms");
	});

	test("reports an empty build", () => {
		expect(reportSummary(0, [])).toBe("0 files, 0 B in 0ms");
	});
});
