import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import readPlugins, { BUNFIG, type Bunfig } from "./readPlugins";

vi.mock("#utils/logger", () => ({
	createLogger: () => ({
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	}),
}));

interface MockBunOption {
	/** Content of `bunfig.toml`, `undefined` when the file is missing. */
	bunfig?: string;
	/** Result of parsing the content, or an error thrown while parsing. */
	toml?: Bunfig | Error;
	/** Module specifier each plugin name resolves to. */
	resolved?: Record<string, string>;
}

const createMockBun = ({ bunfig, toml, resolved = {} }: MockBunOption) => {
	const file = vi.fn(() => ({
		exists: () => Promise.resolve(bunfig !== undefined),
		text: () => Promise.resolve(bunfig ?? ""),
	}));

	const parse = vi.fn(() => {
		if (toml instanceof Error) throw toml;
		return toml ?? {};
	});

	const bunResolve = vi.fn((name: string) => {
		const path = resolved[name];
		if (path === undefined) return Promise.reject(new Error("not found"));
		return Promise.resolve(path);
	});

	return {
		bun: {
			file,
			resolve: bunResolve,
			TOML: { parse },
		} as unknown as BunType,
		file,
	};
};

const option = { cwd: "/repo" };

describe("readPlugins", () => {
	test("reads the bunfig of the working directory", async () => {
		const { bun, file } = createMockBun({});

		await readPlugins(bun, option);

		expect(file).toHaveBeenCalledWith(resolve("/repo", BUNFIG));
	});

	test.each<{ name: string; mock: MockBunOption }>([
		{ name: "bunfig.toml is missing", mock: {} },
		{ name: "the plugins array is missing", mock: { bunfig: "", toml: {} } },
		{
			name: "the plugins array is not an array",
			mock: {
				bunfig: "",
				toml: { serve: { static: { plugins: "one" } } } as unknown as Bunfig,
			},
		},
		{
			name: "the content cannot be parsed",
			mock: { bunfig: "not toml", toml: new Error("invalid toml") },
		},
	])("loads nothing when $name", async ({ mock }) => {
		const { bun } = createMockBun(mock);

		await expect(readPlugins(bun, option)).resolves.toEqual([]);
	});

	test("loads the default export of every plugin", async () => {
		const { bun } = createMockBun({
			bunfig: "",
			toml: { serve: { static: { plugins: ["node:path"] } } },
			resolved: { "node:path": "node:path" },
		});

		const plugins = await readPlugins(bun, option);

		expect(plugins).toHaveLength(1);
		expect(plugins[0]).toHaveProperty("resolve");
	});

	test("loads the module itself when it has no default export", async () => {
		const { bun } = createMockBun({
			bunfig: "",
			toml: { serve: { static: { plugins: ["named"] } } },
			resolved: {
				named: "data:text/javascript,export const name = 'named'",
			},
		});

		await expect(readPlugins(bun, option)).resolves.toMatchObject([
			{ name: "named" },
		]);
	});

	test("skips a plugin that cannot be resolved", async () => {
		const { bun } = createMockBun({
			bunfig: "",
			toml: { serve: { static: { plugins: ["missing", "node:path"] } } },
			resolved: { "node:path": "node:path" },
		});

		await expect(readPlugins(bun, option)).resolves.toHaveLength(1);
	});
});
