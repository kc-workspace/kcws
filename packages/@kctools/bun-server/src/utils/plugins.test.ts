import { error, info } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test, vi } from "vitest";
import { BUNFIG, loadPlugins, pluginNames, reportPlugins } from "./plugins";

// Absolute path to the module bunfig.toml plugin names resolve to
const PLUGIN_FIXTURE_PATH = new URL(
	"../commands/__fixtures__/plugin.ts",
	import.meta.url,
).pathname;

interface MockOptions {
	/** Whether a bunfig.toml exists next to the command */
	exists?: boolean;
	/** Value `Bun.TOML.parse` returns for its content */
	parsed?: unknown;
	/** Error `Bun.TOML.parse` throws instead of returning */
	parseError?: Error;
	/** Path `Bun.resolveSync` returns for a plugin name */
	resolved?: string;
	/** Error `Bun.resolveSync` throws instead of returning */
	resolveError?: Error;
}

const createMockBun = ({
	exists = true,
	parsed = {},
	parseError,
	resolved = PLUGIN_FIXTURE_PATH,
	resolveError,
}: MockOptions = {}) =>
	({
		file: vi.fn().mockReturnValue({
			exists: async () => exists,
			text: async () => "",
		}),
		TOML: {
			parse: vi.fn().mockImplementation(() => {
				if (parseError) throw parseError;
				return parsed;
			}),
		},
		resolveSync: vi.fn().mockImplementation(() => {
			if (resolveError) throw resolveError;
			return resolved;
		}),
	}) as unknown as typeof BunType;

describe("pluginNames", () => {
	test("reads bunfig.toml next to the given directory", async () => {
		const mockBun = createMockBun();

		await pluginNames(mockBun, "/project");

		expect(mockBun.file).toHaveBeenCalledWith(resolve("/project", BUNFIG));
	});

	test("returns nothing when the file does not exist", async () => {
		const mockBun = createMockBun({ exists: false });

		expect(await pluginNames(mockBun, "/project")).toEqual([]);
		expect(mockBun.TOML.parse).not.toHaveBeenCalled();
	});

	test("returns the names declared under serve.static.plugins", async () => {
		const mockBun = createMockBun({
			parsed: {
				serve: { static: { plugins: ["bun-plugin-tailwind", "other"] } },
			},
		});

		expect(await pluginNames(mockBun, "/project")).toEqual([
			"bun-plugin-tailwind",
			"other",
		]);
	});

	test("returns nothing when the section is absent", async () => {
		const mockBun = createMockBun({ parsed: { serve: {} } });

		expect(await pluginNames(mockBun, "/project")).toEqual([]);
	});

	test("returns nothing when plugins is not an array", async () => {
		const mockBun = createMockBun({
			parsed: { serve: { static: { plugins: "bun-plugin-tailwind" } } },
		});

		expect(await pluginNames(mockBun, "/project")).toEqual([]);
	});

	test("drops entries that are not strings", async () => {
		const mockBun = createMockBun({
			parsed: { serve: { static: { plugins: ["keep", 42, null] } } },
		});

		expect(await pluginNames(mockBun, "/project")).toEqual(["keep"]);
	});

	test("reports unparsable content and returns nothing", async () => {
		const mockBun = createMockBun({ parseError: new Error("line 3") });

		expect(await pluginNames(mockBun, "/project")).toEqual([]);
		expect(error).toHaveBeenCalledWith("Cannot read bunfig.toml: line 3");
	});
});

describe("reportPlugins", () => {
	test("logs every name on one line", () => {
		reportPlugins(["bun-plugin-tailwind", "other"]);

		expect(info).toHaveBeenCalledWith(
			"Plugins from bunfig.toml: bun-plugin-tailwind, other",
		);
	});

	test("logs nothing when there are no plugins", () => {
		reportPlugins([]);

		expect(info).not.toHaveBeenCalled();
	});
});

describe("loadPlugins", () => {
	test("imports the default export of every name", async () => {
		const mockBun = createMockBun();

		expect(
			await loadPlugins(mockBun, ["bun-plugin-tailwind"], "/project"),
		).toEqual([{ name: "fixture-plugin" }]);
	});

	test("resolves each name against the given directory", async () => {
		const mockBun = createMockBun();

		await loadPlugins(mockBun, ["bun-plugin-tailwind"], "/project");

		expect(mockBun.resolveSync).toHaveBeenCalledWith(
			"bun-plugin-tailwind",
			"/project",
		);
	});

	test("returns nothing when no name is given", async () => {
		const mockBun = createMockBun();

		expect(await loadPlugins(mockBun, [], "/project")).toEqual([]);
	});

	test("reports and skips a plugin that cannot be imported", async () => {
		const mockBun = createMockBun({ resolved: "/missing/plugin.ts" });

		expect(await loadPlugins(mockBun, ["missing"], "/project")).toEqual([]);
		expect(error).toHaveBeenCalledWith(
			expect.stringContaining("Cannot load plugin missing:"),
		);
	});

	test("falls back to the bare name when it cannot be resolved", async () => {
		const mockBun = createMockBun({ resolveError: new Error("not found") });

		expect(
			await loadPlugins(mockBun, ["@kctools/no-such-plugin"], "/project"),
		).toEqual([]);
		expect(error).toHaveBeenCalledWith(
			expect.stringContaining("Cannot load plugin @kctools/no-such-plugin:"),
		);
	});

	test("keeps the plugins that do load", async () => {
		const mockBun = createMockBun();
		(mockBun.resolveSync as unknown as ReturnType<typeof vi.fn>)
			.mockReturnValueOnce("/missing/plugin.ts")
			.mockReturnValueOnce(PLUGIN_FIXTURE_PATH);

		expect(await loadPlugins(mockBun, ["missing", "good"], "/project")).toEqual(
			[{ name: "fixture-plugin" }],
		);
	});
});
