import type { Serve } from "bun";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import createServer from "./createServer";

type ServeConfig = Serve.Options<undefined, string> & {
	fetch: (request: Request) => Response;
};

const createMockBun = (
	serve: (config: ServeConfig) => unknown = () => ({ url: "http://host" }),
) => {
	const mock = vi.fn(serve);
	return { bun: { serve: mock } as unknown as BunType, serve: mock };
};

const lastConfig = (serve: ReturnType<typeof vi.fn>): ServeConfig =>
	serve.mock.lastCall?.[0] as ServeConfig;

describe("createServer", () => {
	test("returns the server created by Bun", () => {
		const server = { url: "http://127.0.0.1:3000" };
		const { bun } = createMockBun(() => server);

		expect(createServer(bun, "127.0.0.1", "3000", false, {})).toBe(server);
	});

	test("passes the hostname and the parsed port", () => {
		const { bun, serve } = createMockBun();

		createServer(bun, "127.0.0.1", "3000", false, {});

		expect(lastConfig(serve)).toMatchObject({
			hostname: "127.0.0.1",
			port: 3000,
			development: true,
		});
	});

	test("normalizes the given port", () => {
		const { bun, serve } = createMockBun();

		createServer(bun, "127.0.0.1", "1001", false, {});

		expect(lastConfig(serve).port).toBe(1024);
	});

	test("keeps the given options", () => {
		const { bun, serve } = createMockBun();
		const routes = { "/": new Response("home") };

		createServer(bun, "127.0.0.1", "3000", false, { routes });

		expect(lastConfig(serve).routes).toBe(routes);
	});

	test("lets the given options override the defaults", () => {
		const { bun, serve } = createMockBun();

		createServer(bun, "127.0.0.1", "3000", false, { development: false });

		expect(lastConfig(serve).development).toBe(false);
	});

	test("answers with not found when no fetch handler is given", async () => {
		const { bun, serve } = createMockBun();

		createServer(bun, "127.0.0.1", "3000", false, {});
		const response = lastConfig(serve).fetch(
			new Request("http://127.0.0.1:3000/"),
		);

		expect(response.status).toBe(404);
		await expect(response.text()).resolves.toBe("Not Found");
	});

	test("retries on the next port when the port is in use", () => {
		const server = { url: "http://127.0.0.1:3001" };
		let attempt = 0;
		const { bun, serve } = createMockBun(() => {
			attempt++;
			if (attempt === 1) throw new Error("EADDRINUSE");
			return server;
		});

		expect(createServer(bun, "127.0.0.1", "3000", true, {})).toBe(server);
		expect(serve).toHaveBeenCalledTimes(2);
		expect(lastConfig(serve).port).toBe(3001);
	});

	test("rethrows when the next port is not allowed", () => {
		const error = new Error("EADDRINUSE");
		const { bun, serve } = createMockBun(() => {
			throw error;
		});

		expect(() => createServer(bun, "127.0.0.1", "3000", false, {})).toThrow(
			error,
		);
		expect(serve).toHaveBeenCalledOnce();
	});

	test("gives up after ten attempts", () => {
		const { bun, serve } = createMockBun(() => {
			throw new Error("EADDRINUSE");
		});

		expect(() => createServer(bun, "127.0.0.1", "3000", true, {})).toThrow(
			"Failed to create server after 10 attempts",
		);
		expect(serve).toHaveBeenCalledTimes(10);
	});

	test("gives up when Bun never returns a server", () => {
		const { bun, serve } = createMockBun(() => undefined);

		expect(() => createServer(bun, "127.0.0.1", "3000", true, {})).toThrow(
			"Failed to create server after 10 attempts",
		);
		expect(serve).toHaveBeenCalledTimes(10);
	});
});
