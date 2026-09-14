import { error, log, warn } from "node:console";
import type * as BunType from "bun";
import { describe, expect, test, vi } from "vitest";
import { listen, MAX_PORT_ATTEMPTS, parsePort } from "./serve";

const createMockBun = (serve: unknown) =>
	({ serve }) as unknown as typeof BunType;

const okServe = (url = "http://127.0.0.1:3000") =>
	vi.fn().mockReturnValue({ url: new URL(url) });

describe("parsePort", () => {
	test("parses a valid numeric port", () => {
		expect(parsePort("8080")).toBe(8080);
	});

	test("accepts the minimum valid port", () => {
		expect(parsePort("1")).toBe(1);
	});

	test("accepts the maximum valid port", () => {
		expect(parsePort("65535")).toBe(65535);
	});

	test("rejects a non-numeric value", () => {
		expect(parsePort("abc")).toBeUndefined();
	});

	test("rejects port 0", () => {
		expect(parsePort("0")).toBeUndefined();
	});

	test("rejects a negative port", () => {
		expect(parsePort("-1")).toBeUndefined();
	});

	test("rejects a port above the maximum", () => {
		expect(parsePort("65536")).toBeUndefined();
	});
});

describe("listen", () => {
	test("serves with the options built for the requested port", () => {
		const serve = okServe();
		const create = vi.fn().mockReturnValue({ marker: true });

		listen(createMockBun(serve), { port: 3000, nextPort: false }, create);

		expect(create).toHaveBeenCalledWith(3000);
		expect(serve).toHaveBeenCalledWith({ marker: true });
	});

	test("returns the started server", () => {
		const server = { url: new URL("http://127.0.0.1:3000") };
		const serve = vi.fn().mockReturnValue(server);

		const result = listen(
			createMockBun(serve),
			{ port: 3000, nextPort: false },
			() => ({}),
		);

		expect(result).toBe(server);
	});

	test("logs the listening url", () => {
		listen(
			createMockBun(okServe("http://127.0.0.1:4000")),
			{ port: 4000, nextPort: false },
			() => ({}),
		);

		expect(log).toHaveBeenCalledWith("Listening on http://127.0.0.1:4000/");
	});

	test("logs the error and gives up when the port is taken without nextPort", () => {
		const failure = new Error("Port 3000 already in use");
		const serve = vi.fn().mockImplementation(() => {
			throw failure;
		});

		const result = listen(
			createMockBun(serve),
			{ port: 3000, nextPort: false },
			() => ({}),
		);

		expect(error).toHaveBeenCalledWith(failure);
		expect(serve).toHaveBeenCalledTimes(1);
		expect(result).toBeUndefined();
	});

	test("warns and retries the next port when nextPort is set", () => {
		const serve = vi
			.fn()
			.mockImplementationOnce(() => {
				throw new Error("Port in use");
			})
			.mockReturnValueOnce({ url: new URL("http://127.0.0.1:3001") });
		const create = vi.fn().mockReturnValue({});

		listen(createMockBun(serve), { port: 3000, nextPort: true }, create);

		expect(warn).toHaveBeenCalledWith("Port 3000 is in use, trying 3001...");
		expect(create).toHaveBeenNthCalledWith(2, 3001);
		expect(log).toHaveBeenCalledWith("Listening on http://127.0.0.1:3001/");
	});

	test("gives up after MAX_PORT_ATTEMPTS when every port is taken", () => {
		const serve = vi.fn().mockImplementation(() => {
			throw new Error("Port in use");
		});

		const result = listen(
			createMockBun(serve),
			{ port: 3000, nextPort: true },
			() => ({}),
		);

		expect(serve).toHaveBeenCalledTimes(MAX_PORT_ATTEMPTS);
		expect(result).toBeUndefined();
	});

	test("reports failure after exhausting every attempt", () => {
		const serve = vi.fn().mockImplementation(() => {
			throw new Error("Port in use");
		});

		listen(createMockBun(serve), { port: 3000, nextPort: true }, () => ({}));

		expect(error).toHaveBeenCalledWith(
			`Unable to find a free port after ${MAX_PORT_ATTEMPTS} attempts`,
		);
	});

	test("logs the underlying failure after exhausting every attempt", () => {
		const failure = new Error("hostname is invalid");
		const serve = vi.fn().mockImplementation(() => {
			throw failure;
		});

		listen(createMockBun(serve), { port: 3000, nextPort: true }, () => ({}));

		expect(error).toHaveBeenCalledWith(failure);
	});
});
