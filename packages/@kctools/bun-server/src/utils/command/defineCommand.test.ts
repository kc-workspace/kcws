import { describe, expect, test, vi } from "vitest";
import defineCommand from "./defineCommand";

describe("defineCommand", () => {
	test("returns the definition as it is given", () => {
		const action = vi.fn();

		expect(defineCommand("dev", "Start the server", action)).toEqual({
			name: "dev",
			description: "Start the server",
			action,
		});
	});

	test("does not run the action", () => {
		const action = vi.fn();

		defineCommand("dev", "Start the server", action);

		expect(action).not.toHaveBeenCalled();
	});
});
