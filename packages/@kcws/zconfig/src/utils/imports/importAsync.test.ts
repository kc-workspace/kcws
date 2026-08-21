import { describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "../errors";
import importAsync from "./importAsync";

describe(importAsync.name, () => {
	test("should resolve an installed optional peer dependency", async () => {
		type JsonModule = { parse: (text: string) => unknown };
		const json5 = await importAsync<JsonModule>("json5", "json5");

		expect(typeof json5.parse).toBe("function");
		expect(json5.parse("{a: 1}")).toStrictEqual({ a: 1 });
	});

	test("should return the identical module on a repeat call", async () => {
		const first = await importAsync("json5", "json5");
		const second = await importAsync("json5", "json5");

		expect(second).toBe(first);
	});

	test("should resolve a package whose only CJS entry is an exports condition", async () => {
		type TomlModule = { parse: (text: string) => unknown };
		const toml = await importAsync<TomlModule>("toml", "smol-toml");

		expect(typeof toml.parse).toBe("function");
	});

	test("should throw ZconfigAdapterError when the module is absent", async () => {
		const act = async () => importAsync("yaml", "zconfig-absent-package");
		await expect(act).rejects.toThrow(ZconfigAdapterError);
	});

	test("should name the adapter and the missing package in the error", async () => {
		importAsync("yaml", "zconfig-absent-package")
			.then(() => expect.unreachable("importAsync should have thrown"))
			.catch((error) => {
				expect(error).toBeInstanceOf(ZconfigAdapterError);
				const adapterError = error as ZconfigAdapterError;

				expect(adapterError.adapter).toBe("yaml");
				expect(adapterError.message).toContain("zconfig-absent-package");
				expect(adapterError.message).toContain("install");
				expect(adapterError.cause).toBeDefined();
			});
	});
});
