import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import getFile from "./getFile";

const createMockBun = (existing: string[]) => {
	const file = vi.fn((path: string) => ({
		name: path,
		exists: () => Promise.resolve(existing.includes(path)),
	}));
	return { bun: { file } as unknown as BunType, file };
};

describe("getFile", () => {
	test("returns the file when it exists", async () => {
		const { bun } = createMockBun(["/repo/dist/index.html"]);

		await expect(getFile(bun, "/repo/dist/index.html")).resolves.toMatchObject({
			name: "/repo/dist/index.html",
		});
	});

	test("returns undefined when the file is missing", async () => {
		const { bun } = createMockBun([]);

		await expect(
			getFile(bun, "/repo/dist/missing.html"),
		).resolves.toBeUndefined();
	});

	test("asks Bun for the given path", async () => {
		const { bun, file } = createMockBun([]);

		await getFile(bun, "/repo/dist/index.html");

		expect(file).toHaveBeenCalledWith("/repo/dist/index.html");
	});
});
