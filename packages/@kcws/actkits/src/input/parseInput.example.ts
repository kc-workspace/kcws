import { z } from "zod";

import { parseInput } from "./parseInput";

const schema = z.object({
	mode: z.enum(["warn", "fail"]),
	token: z.string(),
});

// Example with the default INPUT prefix and process.env.
parseInput(schema);

// Example with the default INPUT prefix.
parseInput(schema, undefined, {
	INPUT__MODE: "warn",
	INPUT__TOKEN: "secret-token",
});

// Example with a custom prefix (dot notation).
parseInput(schema, "my.action", {
	MY__ACTION__MODE: "fail",
	MY__ACTION__TOKEN: "custom-token",
});

// Example with a custom prefix (path notation).
parseInput(schema, "org/abc", {
	ORG__ABC__MODE: "fail",
	ORG__ABC__TOKEN: "custom-token",
});
