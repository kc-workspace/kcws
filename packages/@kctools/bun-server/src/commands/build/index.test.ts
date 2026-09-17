import type { BuildConfig, BuildOutput } from "bun";
import { Command } from "commander";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import build from "./index";

const log = vi.hoisted(() => ({
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
}));

vi.mock("#utils/logger", () => ({ createLogger: () => log }));

interface MockBunOption {
	/** Files each scanned directory holds, keyed by directory. */
	files?: Record<string, string[]>;
	/** Artifacts `Bun.build()` reports. */
	outputs?: Array<{ path: string; size: number; kind: string }>;
	/** Whether `Bun.build()` succeeds. */
	success?: boolean;
}

const createMockBun = ({
	files = {},
	outputs = [],
	success = true,
}: MockBunOption) => {
	const scan = vi.fn(function* (option: { cwd: string }): Generator<string> {
		yield* files[option.cwd] ?? [];
	});

	class Glob {
		constructor(public readonly pattern: string) {}
		scan = scan;
	}

	const bunBuild = vi.fn(() =>
		Promise.resolve({ success, outputs } as unknown as BuildOutput),
	);
	const write = vi.fn(() => Promise.resolve(64));

	return {
		bun: {
			Glob,
			file: vi.fn((path: string) => ({
				name: path,
				exists: () => Promise.resolve(false),
			})),
			build: bunBuild,
			write,
		} as unknown as BunType,
		build: bunBuild,
		write,
	};
};

const run = async (bun: BunType, args: string[]): Promise<void> => {
	const command = new Command("build");
	build.action(command, bun);
	await command.parseAsync(args, { from: "user" });
};

const config = (bunBuild: ReturnType<typeof vi.fn>): BuildConfig =>
	bunBuild.mock.lastCall?.[0] as BuildConfig;

const pages = { "/repo/pages": ["/repo/pages/index.html"] };

describe("build", () => {
	beforeEach(() => {
		log.debug.mockClear();
		log.info.mockClear();
		log.warn.mockClear();
		log.error.mockClear();
	});

	test("is described as the build command", () => {
		expect(build).toMatchObject({
			name: "build",
			description: "Build the project using Bun.build()",
		});
	});

	test.each<{ name: string; args: string[]; expected: Partial<BuildConfig> }>([
		{
			name: "builds every route file into the output directory",
			args: [],
			expected: {
				entrypoints: ["/repo/pages/index.html"],
				outdir: "/repo/dist",
				target: "browser",
				format: "esm",
				minify: true,
				splitting: true,
				sourcemap: "linked",
				env: "BUN_PUBLIC_*",
				plugins: [],
			},
		},
		{
			name: "builds into the given output directory",
			args: ["--out", "public"],
			expected: { outdir: "/repo/public" },
		},
		{
			name: "disables minification on request",
			args: ["--no-minify"],
			expected: { minify: false },
		},
	])("$name", async ({ args, expected }) => {
		const { bun, build: bunBuild } = createMockBun({ files: pages });

		await run(bun, ["pages", "--cwd", "/repo", ...args]);

		expect(config(bunBuild)).toMatchObject(expected);
	});

	test("copies the static files next to the build output", async () => {
		const { bun, write } = createMockBun({
			files: { ...pages, "/repo/assets": ["/repo/assets/logo.png"] },
			outputs: [
				{ path: "/repo/dist/index.js", size: 128, kind: "entry-point" },
			],
		});

		await run(bun, ["pages", "--cwd", "/repo", "--statics", "assets"]);

		expect(write).toHaveBeenCalledWith(
			"/repo/dist/assets/logo.png",
			expect.objectContaining({ name: "/repo/assets/logo.png" }),
		);
	});

	test("reports every artifact and the summary", async () => {
		const { bun } = createMockBun({
			files: pages,
			outputs: [
				{ path: "/repo/dist/index.js", size: 1024, kind: "entry-point" },
			],
		});

		await run(bun, ["pages", "--cwd", "/repo"]);

		const messages = log.info.mock.calls.map(([message]) => message);
		expect(messages).toContain("dist/index.js  1.00 KB  entry");
		expect(messages.at(-1)).toMatch(/^1 file, 1\.00 KB in /);
	});

	test("reports the copied static files too", async () => {
		const { bun } = createMockBun({
			files: { ...pages, "/repo/assets": ["/repo/assets/logo.png"] },
			outputs: [
				{ path: "/repo/dist/index.js", size: 128, kind: "entry-point" },
			],
		});

		await run(bun, ["pages", "--cwd", "/repo", "--statics", "assets"]);

		expect(log.info.mock.calls.map(([message]) => message)).toContain(
			"dist/assets/logo.png   64 B  static",
		);
	});

	test("stops before building when there is no route file", async () => {
		const { bun, build: bunBuild } = createMockBun({});

		await run(bun, ["pages", "--cwd", "/repo"]);

		expect(bunBuild).not.toHaveBeenCalled();
		expect(log.warn).toHaveBeenCalledWith(
			"No route files found. Nothing to build.",
		);
	});

	test("stops when the build fails", async () => {
		const { bun, write } = createMockBun({ files: pages, success: false });

		await run(bun, ["pages", "--cwd", "/repo"]);

		expect(log.error).toHaveBeenCalledWith("\nBuild failed!");
		expect(write).not.toHaveBeenCalled();
	});

	test("stops when a static file would overwrite the build output", async () => {
		const { bun, write } = createMockBun({
			files: { ...pages, "/repo/assets": ["/repo/assets/index.js"] },
			outputs: [
				{ path: "/repo/dist/assets/index.js", size: 128, kind: "entry-point" },
			],
		});

		await run(bun, ["pages", "--cwd", "/repo", "--statics", "assets"]);

		expect(log.error).toHaveBeenCalledWith(
			{ overwritten: ["/repo/dist/assets/index.js"] },
			"The following static files will overwrite build output",
		);
		expect(write).not.toHaveBeenCalled();
	});
});
