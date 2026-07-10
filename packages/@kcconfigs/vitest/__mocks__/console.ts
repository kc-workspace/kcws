/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { vi } from "vitest";

vi.mock(import("node:console"), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		debug: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	};
});
