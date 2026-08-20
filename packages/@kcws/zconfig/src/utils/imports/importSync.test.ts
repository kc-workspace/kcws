import { describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "../errors";
import importSync from "./importSync";

describe(importSync.name, () => {
	test("should resolve an installed optional peer dependency", () => {
		type JsonModule = { parse: (text: string) => unknown };
		const json5 = importSync<JsonModule>("json5", "json5");

		expect(typeof json5.parse).toBe("function");
		expect(json5.parse("{a: 1}")).toStrictEqual({ a: 1 });
	});

	test("should return the identical module on a repeat call", () => {
		const first = importSync("json5", "json5");
		const second = importSync("json5", "json5");

		expect(second).toBe(first);
	});

	test("should resolve a package whose only CJS entry is an exports condition", () => {
		type TomlModule = { parse: (text: string) => unknown };
		const toml = importSync<TomlModule>("toml", "smol-toml");

		expect(typeof toml.parse).toBe("function");
	});

	test("should throw ZconfigAdapterError when the module is absent", () => {
		const act = () => importSync("yaml", "zconfig-absent-package");
		expect(act).toThrow(ZconfigAdapterError);
	});

	test("should name the adapter and the missing package in the error", () => {
		try {
			importSync("yaml", "zconfig-absent-package");
			expect.unreachable("importSync should have thrown");
		} catch (error) {
			expect(error).toBeInstanceOf(ZconfigAdapterError);
			const adapterError = error as ZconfigAdapterError;

			expect(adapterError.adapter).toBe("yaml");
			expect(adapterError.message).toContain("zconfig-absent-package");
			expect(adapterError.message).toContain("install");
			expect(adapterError.cause).toBeDefined();
		}
	});
});
