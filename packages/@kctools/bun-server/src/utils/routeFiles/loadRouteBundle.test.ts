import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import loadRouteBundle from "./loadRouteBundle";

describe("loadRouteBundle", () => {
	test("resolves to the default export of the imported module", async () => {
		const path = fileURLToPath(
			new URL("./loadRouteBundle.ts", import.meta.url),
		);

		await expect(loadRouteBundle(path)).resolves.toBe(loadRouteBundle);
	});

	test("rejects when the module cannot be imported", async () => {
		await expect(loadRouteBundle("/missing/page.html")).rejects.toThrow();
	});
});
