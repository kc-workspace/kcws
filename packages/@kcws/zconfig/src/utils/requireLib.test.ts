import { describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "./errors";
import { requireLib } from "./requireLib";

describe("requireLib", () => {
	test("should resolve an installed optional peer dependency", () => {
		const json5 = requireLib<{ parse: (text: string) => unknown }>(
			"json5",
			"json5",
		);

		expect(typeof json5.parse).toBe("function");
		expect(json5.parse("{a: 1}")).toStrictEqual({ a: 1 });
	});

	test("should return the identical module on a repeat call", () => {
		const first = requireLib("json5", "json5");
		const second = requireLib("json5", "json5");

		expect(second).toBe(first);
	});

	test("should resolve a package whose only CJS entry is an exports condition", () => {
		const toml = requireLib<{ parse: (text: string) => unknown }>(
			"toml",
			"smol-toml",
		);

		expect(typeof toml.parse).toBe("function");
	});

	test("should throw ZconfigAdapterError when the module is absent", () => {
		expect(() => requireLib("yaml", "zconfig-absent-package")).toThrow(
			ZconfigAdapterError,
		);
	});

	test("should name the adapter and the missing package in the error", () => {
		try {
			requireLib("yaml", "zconfig-absent-package");
			expect.unreachable("requireLib should have thrown");
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
