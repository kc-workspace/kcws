import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { createLogger } from "./createLogger";

vi.mock("@actions/core", () => ({
	debug: vi.fn(),
	endGroup: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	isDebug: vi.fn(() => false),
	notice: vi.fn(),
	startGroup: vi.fn(),
	warning: vi.fn(),
}));

describe("createLogger", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		delete process.env.DEBUG;
	});

	afterEach(() => {
		delete process.env.DEBUG;
	});

	test("should compose namespace with ':' separators", () => {
		const logger = createLogger("stm", "action-a", "http");
		expect(logger.namespace).toBe("stm:action-a:http");

		const child = logger.extend("parser");
		expect(child.namespace).toBe("stm:action-a:http:parser");
	});

	test("should support printf style formatting for info/debug", async () => {
		const { info: mockInfo, debug: mockDebug } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const logger = createLogger("stm", "action-a");
		logger.info("%s world", "hello");
		logger.debug("count=%d payload=%j", 2, { ok: true });

		expect(mockInfo).toHaveBeenCalledWith("[stm:action-a] hello world");
		expect(mockDebug).toHaveBeenCalledWith(
			'[stm:action-a] count=2 payload={"ok":true}',
		);
	});

	test("should pass annotation properties when provided as last argument", async () => {
		const {
			warning: mockWarning,
			error: mockError,
			notice: mockNotice,
		} = await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const logger = createLogger("stm");

		logger.warn("warn %s", "msg", { file: "a.ts", startLine: 1 });
		logger.error("error %s", "msg", { title: "boom" });
		logger.notice("notice %s", "msg", { file: "b.ts", endLine: 3 });

		expect(mockWarning).toHaveBeenCalledWith("[stm] warn msg", {
			file: "a.ts",
			startLine: 1,
		});
		expect(mockError).toHaveBeenCalledWith("[stm] error msg", {
			title: "boom",
		});
		expect(mockNotice).toHaveBeenCalledWith("[stm] notice msg", {
			endLine: 3,
			file: "b.ts",
		});
	});

	test("should call annotation log without properties when last arg is not annotation object", async () => {
		const { warning: mockWarning } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const logger = createLogger("stm");
		logger.warn("warn %j", { custom: true });

		expect(mockWarning).toHaveBeenCalledWith('[stm] warn {"custom":true}');
	});

	test("should run async group and always close it", async () => {
		const { startGroup: mockStartGroup, endGroup: mockEndGroup } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const logger = createLogger("stm");
		const result = await logger.group("publish", async () => "ok");

		expect(result).toBe("ok");
		expect(mockStartGroup).toHaveBeenCalledWith("publish");
		expect(mockEndGroup).toHaveBeenCalled();
	});

	test("should run sync group and always close it", async () => {
		const { startGroup: mockStartGroup, endGroup: mockEndGroup } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const logger = createLogger("stm");
		const result = logger.groupSync("parse", () => 42);

		expect(result).toBe(42);
		expect(mockStartGroup).toHaveBeenCalledWith("parse");
		expect(mockEndGroup).toHaveBeenCalled();
	});

	test("should expose isDebug based on @actions/core", async () => {
		const { isDebug: mockIsDebug } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		vi.mocked(mockIsDebug).mockReturnValue(true);
		expect(createLogger("stm").isDebug).toBe(true);
	});

	test("should expose isDebug based on DEBUG env when core debug is false", async () => {
		const { isDebug: mockIsDebug } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		vi.mocked(mockIsDebug).mockReturnValue(false);
		process.env.DEBUG = "1";
		expect(createLogger("stm").isDebug).toBe(true);
		delete process.env.DEBUG;
	});
});
