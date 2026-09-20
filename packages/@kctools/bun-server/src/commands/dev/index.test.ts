import type { Serve } from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import dev from "./index";

vi.mock("#utils/routeFiles", async (importOriginal) => ({
	...(await importOriginal<typeof import("#utils/routeFiles")>()),
	loadRouteBundle: vi.fn((path: string) =>
		Promise.resolve({ name: path, kind: "bundle" }),
	),
}));

vi.mock("#utils/logger", () => ({
	createLogger: () => ({
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	}),
}));

type ServeConfig = Serve.Options<undefined, string>;

const createMockBun = (files: Record<string, string[]>) => {
	const scan = vi.fn(function* (option: { cwd: string }): Generator<string> {
		yield* files[option.cwd] ?? [];
	});

	class Glob {
		constructor(public readonly pattern: string) {}
		scan = scan;
	}

	const serve = vi.fn(() => ({ url: "http://127.0.0.1:3000" }));

	return {
		bun: {
			Glob,
			file: vi.fn((path: string) => ({
				name: path,
				kind: "file",
				exists: () => Promise.resolve(false),
			})),
			serve,
		} as unknown as BunType,
		serve,
	};
};

const run = async (bun: BunType, args: string[]): Promise<void> => {
	const command = new Command("dev");
	dev.action(command, bun);
	await command.parseAsync(args, { from: "user" });
};

const config = (serve: ReturnType<typeof vi.fn>): ServeConfig =>
	serve.mock.lastCall?.[0] as ServeConfig;

const routes = (serve: ReturnType<typeof vi.fn>): Record<string, unknown> =>
	(config(serve).routes ?? {}) as Record<string, unknown>;

/** The route table reduced to the file name each route is served from. */
const servedFiles = (serve: ReturnType<typeof vi.fn>): Record<string, string> =>
	Object.fromEntries(
		Object.entries(routes(serve)).map(([route, file]) => [
			route,
			(file as { name: string }).name,
		]),
	);

/** The route table reduced to how each route is served. */
const servedKinds = (serve: ReturnType<typeof vi.fn>): Record<string, string> =>
	Object.fromEntries(
		Object.entries(routes(serve)).map(([route, value]) => [
			route,
			(value as { kind: string }).kind,
		]),
	);

describe("dev", () => {
	test("is described as the development server command", () => {
		expect(dev).toMatchObject({
			name: "dev",
			description: "Start the development server using Bun.serve()",
		});
	});

	test("serves each route and its wildcard from the route file", async () => {
		const { bun, serve } = createMockBun({
			"/repo/pages": ["/repo/pages/index.html", "/repo/pages/about.html"],
		});

		await run(bun, ["pages", "--cwd", "/repo"]);

		expect(servedFiles(serve)).toEqual({
			"/": "/repo/pages/index.html",
			"/*": "/repo/pages/index.html",
			"/about": "/repo/pages/about.html",
			"/about/*": "/repo/pages/about.html",
		});
	});

	test("serves html routes as bundles so their assets are resolved", async () => {
		const { bun, serve } = createMockBun({
			"/repo/pages": ["/repo/pages/index.html"],
		});

		await run(bun, ["pages", "--cwd", "/repo"]);

		expect(servedKinds(serve)).toEqual({ "/": "bundle", "/*": "bundle" });
	});

	test("serves the static files from their source", async () => {
		const { bun, serve } = createMockBun({
			"/repo/assets": ["/repo/assets/logo.png"],
		});

		await run(bun, ["--cwd", "/repo", "--statics", "assets"]);

		expect(servedFiles(serve)["/assets/logo.png"]).toBe(
			"/repo/assets/logo.png",
		);
		expect(servedKinds(serve)["/assets/logo.png"]).toBe("file");
	});

	test("falls back to the default route directory", async () => {
		const { bun, serve } = createMockBun({
			"/repo/src/routes": ["/repo/src/routes/index.html"],
		});

		await run(bun, ["--cwd", "/repo"]);

		expect(Object.keys(routes(serve))).toEqual(["/", "/*"]);
	});

	test.each([
		{
			name: "binds the default hostname and port",
			args: [],
			expected: { hostname: "127.0.0.1", port: 3000 },
		},
		{
			name: "binds the given hostname and port",
			args: ["-h", "0.0.0.0", "-p", "8080"],
			expected: { hostname: "0.0.0.0", port: 8080 },
		},
	])("$name", async ({ args, expected }) => {
		const { bun, serve } = createMockBun({});

		await run(bun, ["--cwd", "/repo", ...args]);

		expect(config(serve)).toMatchObject(expected);
	});

	test("starts the server even without any route", async () => {
		const { bun, serve } = createMockBun({});

		await run(bun, ["--cwd", "/repo"]);

		expect(serve).toHaveBeenCalledOnce();
		expect(routes(serve)).toEqual({});
	});

	test("fails when two route files answer the same route", async () => {
		const { bun } = createMockBun({
			"/repo/pages": ["/repo/pages/about.html"],
			"/repo/docs": ["/repo/docs/about.html"],
		});

		await expect(run(bun, ["pages", "docs", "--cwd", "/repo"])).rejects.toThrow(
			"Found duplicated routes: /about",
		);
	});
});
