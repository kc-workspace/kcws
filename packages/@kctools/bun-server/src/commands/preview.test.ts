import { error, log } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import { preview } from "./preview";

const ROOT = resolve(process.cwd(), "dist");

/** A Bun.file stand-in: a Blob that also answers `exists()`. */
const createFile = (content: string | undefined) => {
	const file = new Blob([content ?? ""]) as Blob & {
		exists(): Promise<boolean>;
	};
	file.exists = () => Promise.resolve(content !== undefined);
	return file;
};

const createMockBun = (files: Record<string, string> = {}) =>
	({
		file: vi.fn((path: string) => createFile(files[path])),
		serve: vi.fn().mockReturnValue({ url: new URL("http://127.0.0.1:3000") }),
	}) as unknown as typeof BunType;

const fetchOf = (bun: typeof BunType) => {
	const serve = bun.serve as unknown as ReturnType<typeof vi.fn>;
	return serve.mock.calls[0]?.[0]?.fetch as (
		request: Request,
	) => Promise<Response>;
};

const request = async (bun: typeof BunType, path: string) => {
	const program = new Command();
	preview(program, bun);
	await program.parseAsync(["preview"], { from: "user" });
	return fetchOf(bun)(new Request(`http://127.0.0.1:3000${path}`));
};

describe("preview command registration", () => {
	test("registers a preview subcommand", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		expect(cmd).toBeDefined();
	});

	test("sets the correct description", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		expect(cmd?.description()).toBe("Preview the built website");
	});

	test("accepts an optional directory argument defaulting to dist", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		const args = cmd?.registeredArguments ?? [];

		expect(args).toHaveLength(1);
		expect(args[0]?.name()).toBe("directory");
		expect(args[0]?.required).toBe(false);
		expect(args[0]?.defaultValue).toBe("dist");
	});

	test("has --hostname option defaulting to '127.0.0.1'", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		expect(cmd?.opts()["hostname"]).toBe("127.0.0.1");
	});

	test("has --port option defaulting to '3000'", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		expect(cmd?.opts()["port"]).toBe("3000");
	});

	test("has --next-port option defaulting to false", () => {
		const program = new Command();
		preview(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "preview");
		expect(cmd?.opts()["nextPort"]).toBe(false);
	});
});

describe("preview command action - server", () => {
	test("rejects an invalid port and does not start a server", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		preview(program, mockBun);

		await program.parseAsync(["preview", "--port", "abc"], { from: "user" });

		expect(error).toHaveBeenCalledWith("Invalid port number: abc");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("starts server with default hostname and port", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		preview(program, mockBun);

		await program.parseAsync(["preview"], { from: "user" });

		expect(mockBun.serve).toHaveBeenCalledWith(
			expect.objectContaining({
				hostname: "127.0.0.1",
				port: 3000,
				fetch: expect.any(Function),
			}),
		);
	});

	test("starts server with custom hostname and port", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		preview(program, mockBun);

		await program.parseAsync(
			["preview", "--hostname", "0.0.0.0", "--port", "5000"],
			{ from: "user" },
		);

		expect(mockBun.serve).toHaveBeenCalledWith(
			expect.objectContaining({ hostname: "0.0.0.0", port: 5000 }),
		);
	});

	test("logs the listening URL", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		preview(program, mockBun);

		await program.parseAsync(["preview"], { from: "user" });

		expect(log).toHaveBeenCalledWith("Listening on http://127.0.0.1:3000/");
	});

	test("does not enable development mode", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		preview(program, mockBun);

		await program.parseAsync(["preview"], { from: "user" });

		const serve = mockBun.serve as unknown as ReturnType<typeof vi.fn>;
		expect(serve.mock.calls[0]?.[0]?.development).toBeUndefined();
	});
});

describe("preview command action - static files", () => {
	test("serves an existing file", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "app.js")]: "console.log(1)",
		});

		const response = await request(mockBun, "/app.js");

		expect(response.status).toBe(200);
		await expect(response.text()).resolves.toBe("console.log(1)");
	});

	test("serves index.html of a directory request", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "about/index.html")]: "<h1>about</h1>",
		});

		const response = await request(mockBun, "/about");

		expect(response.status).toBe(200);
		await expect(response.text()).resolves.toBe("<h1>about</h1>");
	});

	test("serves the root index.html for the root request", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "index.html")]: "<h1>home</h1>",
		});

		const response = await request(mockBun, "/");

		expect(response.status).toBe(200);
		await expect(response.text()).resolves.toBe("<h1>home</h1>");
	});

	test("decodes percent encoded paths", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "my file.txt")]: "spaced",
		});

		const response = await request(mockBun, "/my%20file.txt");

		await expect(response.text()).resolves.toBe("spaced");
	});

	test("falls back to the root index.html for an unknown path", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "index.html")]: "<h1>home</h1>",
		});

		const response = await request(mockBun, "/deep/link");

		expect(response.status).toBe(200);
		await expect(response.text()).resolves.toBe("<h1>home</h1>");
	});

	test("returns 404 when neither the file nor the fallback exists", async () => {
		const mockBun = createMockBun({});

		const response = await request(mockBun, "/missing");

		expect(response.status).toBe(404);
	});

	test("returns 403 for an encoded slash escaping the served directory", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "index.html")]: "<h1>home</h1>",
		});

		// %2F survives URL normalisation, so it reaches the handler as ../../
		const response = await request(mockBun, "/..%2F..%2Fetc%2Fpasswd");

		expect(response.status).toBe(403);
	});

	test("keeps a url-normalised parent path inside the served directory", async () => {
		const mockBun = createMockBun({
			[resolve(ROOT, "index.html")]: "<h1>home</h1>",
		});

		// the URL parser collapses ../ before the handler sees it
		const response = await request(mockBun, "/../../etc/passwd");

		expect(response.status).toBe(200);
		expect(mockBun.file).toHaveBeenCalledWith(resolve(ROOT, "etc/passwd"));
	});

	test("does not read any file for an escaping path", async () => {
		const mockBun = createMockBun({});

		await request(mockBun, "/..%2F..%2Fetc%2Fpasswd");

		expect(mockBun.file).not.toHaveBeenCalled();
	});
});

describe("preview command action - custom directory", () => {
	test("serves from the provided directory instead of dist", async () => {
		const custom = resolve(process.cwd(), "custom");
		const mockBun = createMockBun({
			[resolve(custom, "index.html")]: "<h1>custom</h1>",
		});
		const program = new Command();
		preview(program, mockBun);

		await program.parseAsync(["preview", "custom"], { from: "user" });
		const response = await fetchOf(mockBun)(
			new Request("http://127.0.0.1:3000/"),
		);

		await expect(response.text()).resolves.toBe("<h1>custom</h1>");
	});
});
