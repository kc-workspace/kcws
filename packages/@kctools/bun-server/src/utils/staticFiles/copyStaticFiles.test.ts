import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import copyStaticFiles from "./copyStaticFiles";
import type { ResolvedStatic } from "./types";

const createMockBun = (sizes: Record<string, number> = {}) => {
	const file = vi.fn((path: string) => ({ name: path }));
	const write = vi.fn((target: string) => Promise.resolve(sizes[target] ?? 0));
	return { bun: { file, write } as unknown as BunType, file, write };
};

const statik = (name: string): ResolvedStatic => ({
	route: `/assets/${name}`,
	source: `/repo/assets/${name}`,
	target: `/repo/dist/assets/${name}`,
});

describe("copyStaticFiles", () => {
	test("reports every copied file as a static artifact", async () => {
		const { bun } = createMockBun({ "/repo/dist/assets/logo.png": 1024 });

		await expect(copyStaticFiles(bun, [statik("logo.png")])).resolves.toEqual([
			{ path: "/repo/dist/assets/logo.png", size: 1024, kind: "static" },
		]);
	});

	test("writes the source into the target", async () => {
		const { bun, write, file } = createMockBun();

		await copyStaticFiles(bun, [statik("logo.png")]);

		expect(file).toHaveBeenCalledWith("/repo/assets/logo.png");
		expect(write).toHaveBeenCalledWith("/repo/dist/assets/logo.png", {
			name: "/repo/assets/logo.png",
		});
	});

	test("copies every file", async () => {
		const { bun, write } = createMockBun();

		await copyStaticFiles(bun, [statik("a.png"), statik("b.png")]);

		expect(write).toHaveBeenCalledTimes(2);
	});

	test("reports nothing when there is no file", async () => {
		const { bun, write } = createMockBun();

		await expect(copyStaticFiles(bun, [])).resolves.toEqual([]);
		expect(write).not.toHaveBeenCalled();
	});
});
