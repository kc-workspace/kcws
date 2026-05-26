import { getEnv } from "./env";

// Example with default INPUT prefix and process.env
getEnv("token");
// => process.env.INPUT__TOKEN

// Example with default INPUT prefix
getEnv("token", undefined, {
	INPUT__TOKEN: "secret-token",
});
// => "secret-token"

// Example with empty prefix (no prefix)
getEnv("debug", "", {
	DEBUG: "true",
});
// => "true"
