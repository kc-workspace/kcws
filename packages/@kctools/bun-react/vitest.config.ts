import { defineProjectConfig } from "@kcconfigs/vitest";
import { useMockPlugin } from "@kcconfigs/vitest/plugins";

const config = defineProjectConfig(
	useMockPlugin({
		flags: {
			console: true,
		},
	}),
);
export default config;
