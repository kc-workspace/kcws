import { defineConfig } from "@kcconfigs/tsdown";

export default defineConfig({
	platform: "node",
	entry: ["./src/index.ts", "./src/mockHelpers/index.ts"],
});
