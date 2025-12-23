import { describe, expect, test } from "vitest";
import { setupMocks } from "./setupMocks";

describe("setupMocks", () => {
	test("should return empty array when no flags are set", () => {
		const result = setupMocks({
			fs: undefined,
		});

		expect(result).toEqual([]);
	});

	test("should return fs mock path when fs flag is true", () => {
		const result = setupMocks({ fs: true });

		expect(result).toHaveLength(1);
		expect(result[0]).toContain("__mocks__");
		expect(result[0]).toContain("fs.ts");
	});

	test("should return fsPromises mock path when fsPromises flag is true", () => {
		const result = setupMocks({ fsPromises: true });

		expect(result).toHaveLength(1);
		expect(result[0]).toContain("__mocks__");
		expect(result[0]).toContain("fsPromises.ts");
	});

	test("should return process mock path when process flag is true", () => {
		const result = setupMocks({ process: true });

		expect(result).toHaveLength(1);
		expect(result[0]).toContain("__mocks__");
		expect(result[0]).toContain("process.ts");
	});

	test("should return os mock path when os flag is true", () => {
		const result = setupMocks({ os: true, fs: undefined });

		expect(result).toHaveLength(1);
		expect(result[0]).toContain("__mocks__");
		expect(result[0]).toContain("os.ts");
	});

	test("should return multiple mock paths when multiple flags are true", () => {
		const result = setupMocks({ fs: true, process: true });

		expect(result).toHaveLength(2);
		expect(result.some((path) => path.includes("fs.ts"))).toBe(true);
		expect(result.some((path) => path.includes("process.ts"))).toBe(true);
	});

	test("should return all mock paths when all flags are true", () => {
		const result = setupMocks({
			fs: true,
			fsPromises: true,
			process: true,
			os: true,
		});

		expect(result).toHaveLength(4);
		expect(result.some((path) => path.includes("fs.ts"))).toBe(true);
		expect(result.some((path) => path.includes("fsPromises.ts"))).toBe(true);
		expect(result.some((path) => path.includes("process.ts"))).toBe(true);
		expect(result.some((path) => path.includes("os.ts"))).toBe(true);
	});

	test("should ignore flags that are not true", () => {
		const result = setupMocks({ fs: true });

		expect(result).toHaveLength(1);
		expect(result[0]).toContain("fs.ts");
	});

	test("should resolve paths to __mocks__ directory", () => {
		const result = setupMocks({ fs: true });

		expect(result[0]).toContain("__mocks__");
		expect(result[0]).toContain("fs.ts");
	});
});
