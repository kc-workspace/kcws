import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import { dev } from "./dev";

// Absolute path to the HTML fixture used to mock Bun.resolveSync
const HTML_FIXTURE_PATH = new URL("./__fixtures__/html.ts", import.meta.url)
	.pathname;

const createMockBun = (
	serveResult: object = { url: new URL("http://127.0.0.1:3000") },
) =>
	({
		resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
		serve: vi.fn().mockReturnValue(serveResult),
	}) as unknown as typeof BunType;

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

	test("accepts an optional html argument defaulting to ./public/index.html", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		const args = cmd?.registeredArguments ?? [];

		expect(args).toHaveLength(1);
		expect(args[0].name()).toBe("html");
		expect(args[0].defaultValue).toBe("./public/index.html");
		expect(args[0].required).toBe(false);
	});

	test("has --hostname option defaulting to '127.0.0.1'", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts().hostname).toBe("127.0.0.1");
	});

	test("has --port option defaulting to '3000'", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts().port).toBe("3000");
	});

	test("has --next-port option defaulting to false", () => {
		const program = new Command();
		dev(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "dev");
		expect(cmd?.opts().nextPort).toBe(false);
	});
});

describe("dev command action - port validation", () => {
	test("rejects a non-numeric port and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "abc"], { from: "user" });

		expect(errorSpy).toHaveBeenCalledWith("Invalid port number: abc");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("rejects port 0 and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "0"], { from: "user" });

		expect(errorSpy).toHaveBeenCalledWith("Invalid port number: 0");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("rejects a negative port and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "-1"], { from: "user" });

		expect(errorSpy).toHaveBeenCalledWith("Invalid port number: -1");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("rejects port 65536 (above maximum) and logs an error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "65536"], { from: "user" });

		expect(errorSpy).toHaveBeenCalledWith("Invalid port number: 65536");
		expect(mockBun.serve).not.toHaveBeenCalled();
	});

	test("accepts port 1 (minimum valid port) without error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "1"], { from: "user" });

		expect(errorSpy).not.toHaveBeenCalledWith(
			expect.stringContaining("Invalid port"),
		);
	});

	test("accepts port 65535 (maximum valid port) without error", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev", "--port", "65535"], { from: "user" });

		expect(errorSpy).not.toHaveBeenCalledWith(
			expect.stringContaining("Invalid port"),
		);
	});
});

describe("dev command action - server", () => {
	test("resolves html path with Bun.resolveSync using cwd", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(mockBun.resolveSync).toHaveBeenCalledWith(
			"./public/index.html",
			process.cwd(),
		);
	});

	test("resolves custom html path when argument is provided", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev", "./custom/app.html"], { from: "user" });

		expect(mockBun.resolveSync).toHaveBeenCalledWith(
			"./custom/app.html",
			process.cwd(),
		);
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

	test("sets up wildcard route with the imported html content", async () => {
		const program = new Command();
		const mockBun = createMockBun();
		dev(program, mockBun);

		await program.parseAsync(["dev"], { from: "user" });

		expect(mockBun.serve).toHaveBeenCalledWith(
			expect.objectContaining({
				routes: { "/*": expect.anything() },
			}),
		);
	});

	test("logs the listening URL after server starts", async () => {
		const program = new Command();
		const mockBun = createMockBun({ url: new URL("http://127.0.0.1:3000") });
		dev(program, mockBun);

		const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await program.parseAsync(["dev"], { from: "user" });

		expect(logSpy).toHaveBeenCalledWith("Listening on http://127.0.0.1:3000/");
	});

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

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		await program.parseAsync(["dev"], { from: "user" });

		expect(errorSpy).toHaveBeenCalledWith(portError);
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

		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await program.parseAsync(["dev", "--next-port"], { from: "user" });

		expect(warnSpy).toHaveBeenCalledWith("Port 3000 is in use, trying 3001...");
		expect(mockBun.serve).toHaveBeenCalledTimes(2);
		expect(mockBun.serve).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ port: 3001 }),
		);
		expect(logSpy).toHaveBeenCalledWith("Listening on http://127.0.0.1:3001/");
	});

	test("stops after 9 retry attempts when all ports are in use (limit=10, ++count)", async () => {
		const portError = new Error("Port in use");
		const mockBun = {
			resolveSync: vi.fn().mockReturnValue(HTML_FIXTURE_PATH),
			serve: vi.fn().mockImplementation(() => {
				throw portError;
			}),
		} as unknown as typeof BunType;
		const program = new Command();
		dev(program, mockBun);

		vi.spyOn(console, "warn").mockImplementation(() => {});
		await program.parseAsync(["dev", "--next-port"], { from: "user" });

		// while (++count < 10) runs for count 1..9 = 9 iterations
		expect(mockBun.serve).toHaveBeenCalledTimes(9);
	});
});
