import type { Serve } from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import preview from "./index";

vi.mock("#utils/logger", () => ({
	createLogger: () => ({
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	}),
}));

type ServeConfig = Serve.Options<undefined, string> & {
	fetch: (request: Request) => Promise<Response>;
};

/** A Bun file carrying its own content, enough to answer a request. */
const createFile = (path: string, content: string | undefined) =>
	Object.assign(new Blob([content ?? ""]), {
		name: path,
		exists: () => Promise.resolve(content !== undefined),
	});

const createMockBun = (files: Record<string, string>) => {
	const serve = vi.fn(() => ({ url: "http://127.0.0.1:4000" }));
	return {
		bun: {
			file: vi.fn((path: string) => createFile(path, files[path])),
			serve,
		} as unknown as BunType,
		serve,
	};
};

const run = async (bun: BunType, args: string[]): Promise<void> => {
	const command = new Command("preview");
	preview.action(command, bun);
	await command.parseAsync(args, { from: "user" });
};

const config = (serve: ReturnType<typeof vi.fn>): ServeConfig =>
	serve.mock.lastCall?.[0] as ServeConfig;

interface RequestCase {
	name: string;
	/** Content of every file below the working directory. */
	files: Record<string, string>;
	/** Path requested from the preview server. */
	path: string;
	/** Command line arguments, defaulting to the `dist` directory. */
	args?: string[];
	status: number;
	body: string;
}

/** Start the preview server and request a single path from it. */
const request = async (
	files: Record<string, string>,
	url: string,
	args: string[] = ["--cwd", "/repo"],
): Promise<Response> => {
	const { bun, serve } = createMockBun(files);
	await run(bun, args);
	return config(serve).fetch(new Request(url));
};

describe("preview", () => {
	test("is described as the preview server command", () => {
		expect(preview).toMatchObject({
			name: "preview",
			description: "Preview the built website using Bun.serve()",
		});
	});

	test.each([
		{
			name: "binds the default hostname and port",
			args: [],
			expected: { hostname: "127.0.0.1", port: 4000, development: false },
		},
		{
			name: "binds the given hostname and port",
			args: ["-h", "0.0.0.0", "-p", "8080"],
			expected: { hostname: "0.0.0.0", port: 8080, development: false },
		},
	])("$name", async ({ args, expected }) => {
		const { bun, serve } = createMockBun({});

		await run(bun, ["--cwd", "/repo", ...args]);

		expect(config(serve)).toMatchObject(expected);
	});

	describe("request handling", () => {
		test.each<RequestCase>([
			{
				name: "serves a file below the served directory",
				files: { "/repo/dist/app.js": "console.log(1)" },
				path: "/app.js",
				status: 200,
				body: "console.log(1)",
			},
			{
				name: "serves the index of a directory",
				files: { "/repo/dist/blog/index.html": "<h1>blog</h1>" },
				path: "/blog",
				status: 200,
				body: "<h1>blog</h1>",
			},
			{
				name: "serves the html file of an extension less path",
				files: { "/repo/dist/about.html": "<h1>about</h1>" },
				path: "/about",
				status: 200,
				body: "<h1>about</h1>",
			},
			{
				name: "decodes the requested path",
				files: { "/repo/dist/my file.html": "<h1>file</h1>" },
				path: "/my%20file.html",
				status: 200,
				body: "<h1>file</h1>",
			},
			{
				name: "serves from the directory given as argument",
				files: { "/repo/public/app.js": "console.log(1)" },
				path: "/app.js",
				args: ["public", "--cwd", "/repo"],
				status: 200,
				body: "console.log(1)",
			},
			{
				name: "answers not found when the file is missing",
				files: {},
				path: "/missing.html",
				status: 404,
				body: "Not Found",
			},
			{
				name: "answers bad request when the path cannot be decoded",
				files: {},
				path: "/%E0%A4%A",
				status: 400,
				body: "Bad Request",
			},
			{
				name: "answers forbidden when the path escapes the served directory",
				files: { "/repo/secret.txt": "secret" },
				path: "/..%2Fsecret.txt",
				status: 403,
				body: "Forbidden",
			},
		])("$name", async ({ files, path, args, status, body }) => {
			const response = await request(
				files,
				`http://127.0.0.1:4000${path}`,
				args,
			);

			expect(response.status).toBe(status);
			await expect(response.text()).resolves.toBe(body);
		});
	});
});
