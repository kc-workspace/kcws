import { error, log, warn } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import { dev } from "./dev";

// Absolute path to the HTML fixture used to mock Bun.resolveSync
const HTML_FIXTURE_PATH = new URL("./__fixtures__/html.ts", import.meta.url)
	.pathname;

const createMockBun = (
	serveResult: object = { url: new URL("http://127.0.0.1:3000") },
	globFiles: string[] = [],
) =>
	({
		resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
		serve: vi.fn().mockReturnValue(serveResult),
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(): string[] {
				return globFiles;
			}
		},
	}) as unknown as typeof BunType;

const routesOf = (bun: typeof BunType) => {
	const serve = bun.serve as unknown as ReturnType<typeof vi.fn>;
	return serve.mock.calls[0]?.[0]?.routes as Record<string, unknown>;
};

describe("dev command registration", () => {
	test("registers a dev subcommand", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd).toBeDefined();
	});

	test("sets the correct description", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.description()).toBe("Start the development server");
	});

	test("accepts an optional html argument with no static default", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		const args = cmd?.registeredArguments ?? [];

		expect(args).toHaveLength(1);
		expect(args[0]?.name()).toBe("html");
		expect(args[0]?.required).toBe(false);
		expect(args[0]?.defaultValue).toBeUndefined();
	});

	test("has --mode option defaulting to 'spa'", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts()["mode"]).toBe("spa");
	});

	test("rejects a --mode value outside spa and mpa", async () => {
		const program = new Command().exitOverride();
		dev(program, createMockBun());

		await expect(
			program.parseAsync(["dev", "--mode", "ssr"], { from: "user" }),
		).rejects.toThrow();
	});

	test("has --hostname option defaulting to '127.0.0.1'", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts()["hostname"]).toBe("127.0.0.1");
	});

	test("has --port option defaulting to '3000'", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts()["port"]).toBe("3000");
	});

	test("has --next-port option defaulting to false", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts()["nextPort"]).toBe(false);
	});
});

describe("dev command action - port validation", () => {
	test("rejects a non-numeric port and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--port", "abc"], { from: "user" });

		expect(error).toHaveBeenCalledWith("Invalid port number: abc");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("rejects port 0 and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--port", "0"], { from: "user" });

		expect(error).toHaveBeenCalledWith("Invalid port number: 0");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("rejects a port above the maximum and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--port", "65536"], { from: "user" });

		expect(error).toHaveBeenCalledWith("Invalid port number: 65536");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("accepts port 65535 (maximum valid port) without error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--port", "65535"], { from: "user" });

		expect(error).not.toHaveBeenCalledWith(
			expect.stringContaining("Invalid port"),
		);
	});
});

describe("dev command action - spa mode", () => {
	test("resolves the default spa entry relative to cwd", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(mockBun.resolveSync).toHaveBeenCalledWith(
			resolve(process.cwd(), "./public/index.html"),
			process.cwd(),
		);
	});

	test("resolves a custom html path when the argument is provided", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "./custom/app.html"], { from: "user" });

		expect(mockBun.resolveSync).toHaveBeenCalledWith(
			resolve(process.cwd(), "./custom/app.html"),
			process.cwd(),
		);
	});

	test("serves the single page on both the root and the wildcard route", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(Object.keys(routesOf(mockBun)).sort()).toEqual(["/", "/*"]);
	});

	test("starts server with default hostname and port", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(mockBun.serve).toHaveBeenCalledWith(
			expect.objectContaining({
				hostname: "127.0.0.1",
				port: 3000,
				development: true,
			}),
		);
	});

	test("starts server with custom hostname and port", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(
			["dev", "--hostname", "0.0.0.0", "--port", "8080"],
			{ from: "user" },
		);

		expect(mockBun.serve).toHaveBeenCalledWith(
			expect.objectContaining({ hostname: "0.0.0.0", port: 8080 }),
		);
	});

	test("logs the listening URL after server starts", async () => {
		const program = new Command();
		const mockBun = createMockBun({ url: new URL("http://127.0.0.1:3000") });
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(log).toHaveBeenCalledWith("Listening on http://127.0.0.1:3000/");
	});
});

describe("dev command action - mpa mode", () => {
	const routeFile = (relativePath: string) =>
		resolve(process.cwd(), relativePath);

	test("serves one exact and one wildcard route per matched page", async () => {
		const program = new Command();
		const mockBun = createMockBun({ url: new URL("http://127.0.0.1:3000") }, [
			routeFile("src/routes/index.html"),
			routeFile("src/routes/about/index.html"),
		]);
		dev(program, mockBun);

		await program.parseAsync(["dev", "--mode", "mpa"], { from: "user" });

		expect(Object.keys(routesOf(mockBun)).sort()).toEqual([
			"/",
			"/*",
			"/about",
			"/about/*",
		]);
	});

	test("resolves every matched page", async () => {
		const program = new Command();
		const mockBun = createMockBun({ url: new URL("http://127.0.0.1:3000") }, [
			routeFile("src/routes/index.html"),
			routeFile("src/routes/about/index.html"),
		]);
		dev(program, mockBun);

		await program.parseAsync(["dev", "--mode", "mpa"], { from: "user" });

		expect(mockBun.resolveSync).toHaveBeenCalledTimes(2);
	});

	test("errors and does not start a server when two pages claim the same route", async () => {
		const program = new Command();
		const mockBun = createMockBun({ url: new URL("http://127.0.0.1:3000") }, [
			routeFile("src/routes/about/index.html"),
			routeFile("src/routes/about/contact.html"),
		]);
		dev(program, mockBun);

		await program.parseAsync(
			["dev", "--mode", "mpa", "./src/routes/**/*.html"],
			{ from: "user" },
		);

		expect(error).toHaveBeenCalledWith(
			"Multiple HTML entries claim the same route: /about",
		);
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("errors and does not start a server when no page matches", async () => {
		const program = new Command();
		const mockBun = createMockBun(
			{ url: new URL("http://127.0.0.1:3000") },
			[],
		);
		dev(program, mockBun);

		await program.parseAsync(["dev", "--mode", "mpa"], { from: "user" });

		expect(error).toHaveBeenCalledWith(
			"No HTML entry found for ./src/routes/**/index.html",
		);
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("accepts a custom glob pattern", async () => {
		const program = new Command();
		const patterns: string[] = [];
		const mockBun = {
			resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
			serve: vi.fn().mockReturnValue({ url: new URL("http://127.0.0.1:3000") }),
			Glob: class {
				constructor(pattern: string) {
					patterns.push(pattern);
				}
				scanSync(): string[] {
					return [routeFile("src/pages/docs/index.html")];
				}
			},
		} as unknown as typeof BunType;
		dev(program, mockBun);

		await program.parseAsync(
			["dev", "--mode", "mpa", "./src/pages/**/index.html"],
			{ from: "user" },
		);

		expect(patterns).toEqual(["./src/pages/**/index.html"]);
		expect(Object.keys(routesOf(mockBun)).sort()).toEqual(["/docs", "/docs/*"]);
	});
});

describe("dev command action - port retry", () => {
	test("logs error and does not retry when port is in use without --next-port", async () => {
		const portError = new Error("Port 3000 already in use");
		const mockBun = {
			resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
			serve: vi.fn().mockImplementation(() => {
				throw portError;
			}),
		} as unknown as typeof BunType;
		const program = new Command();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(error).toHaveBeenCalledWith(portError);
		expect(mockBun.serve).toHaveBeenCalledTimes(1);
	});

	test("warns and retries with incremented port when --next-port is set", async () => {
		const portError = new Error("Port in use");
		const mockBun = {
			resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
			serve: vi
				.fn()
				.mockImplementationOnce(() => {
					throw portError;
				})
				.mockReturnValueOnce({ url: new URL("http://127.0.0.1:3001") }),
		} as unknown as typeof BunType;
		const program = new Command();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--next-port"], { from: "user" });

		expect(warn).toHaveBeenCalledWith("Port 3000 is in use, trying 3001...");
		expect(mockBun.serve).toHaveBeenCalledTimes(2);
		expect(mockBun.serve).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ port: 3001 }),
		);
		expect(log).toHaveBeenCalledWith("Listening on http://127.0.0.1:3001/");
	});

	test("stops after 10 attempts when all ports are in use", async () => {
		const portError = new Error("Port in use");
		const mockBun = {
			resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
			serve: vi.fn().mockImplementation(() => {
				throw portError;
			}),
		} as unknown as typeof BunType;
		const program = new Command();
		dev(program, mockBun);

		await program.parseAsync(["dev", "--next-port"], { from: "user" });

		expect(mockBun.serve).toHaveBeenCalledTimes(10);
	});
});
