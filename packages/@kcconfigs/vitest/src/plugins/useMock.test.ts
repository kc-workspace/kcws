import { join } from "node:path";
import { describe, expect, test, vi } from "vitest";
import useMockPlugin from "./useMock";

vi.mock("node:fs", () => ({
	existsSync: vi.fn(),
}));

import { existsSync } from "node:fs";

const mockRoot = "/fake/pkg";

describe("useMockPlugin", () => {
	test("should return plugin named 'use-mock'", () => {
		vi.mocked(existsSync).mockReturnValue(true);
		const plugin = useMockPlugin({ root: mockRoot, flags: { fs: true } });
		expect(plugin.name).toBe("use-mock");
	});

	test("should add setupFiles for enabled flags", () => {
		const fsPath = join(mockRoot, "__mocks__", "fs.ts");
		vi.mocked(existsSync).mockImplementation((p) => p === fsPath);

		const plugin = useMockPlugin({ root: mockRoot, flags: { fs: true } });
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.setupFiles).toContain(fsPath);
	});

	test("should add multiple setupFiles when multiple flags enabled", () => {
		vi.mocked(existsSync).mockReturnValue(true);

		const plugin = useMockPlugin({
			root: mockRoot,
			flags: { fs: true, os: true },
		});
		const result = plugin.applyConfig?.({ test: {} });
		const setupFiles = result?.test?.setupFiles as string[];
		expect(setupFiles).toHaveLength(2);
		expect(setupFiles).toContain(join(mockRoot, "__mocks__", "fs.ts"));
		expect(setupFiles).toContain(join(mockRoot, "__mocks__", "os.ts"));
	});

	test("should produce empty setupFiles when no flags enabled", () => {
		const plugin = useMockPlugin({ root: mockRoot, flags: {} });
		const result = plugin.applyConfig?.({ test: {} });
		expect(result?.test?.setupFiles).toHaveLength(0);
	});

	test("should use the package root by default", () => {
		vi.mocked(existsSync).mockReturnValue(true);
		const defaultRoot = join(import.meta.dirname, "..", "..");
		const osPath = join(defaultRoot, "__mocks__", "os.ts");

		const plugin = useMockPlugin({
			flags: { os: true },
		});
		const result = plugin.applyConfig?.({ test: {} });

		expect(result?.test?.setupFiles).toEqual([osPath]);
	});

	test("should throw when mock file does not exist", () => {
		vi.mocked(existsSync).mockReturnValue(false);
		expect(() =>
			useMockPlugin({ root: mockRoot, flags: { fs: true } }),
		).toThrow(`Mock file for "fs" not found at path:`);
	});
});
