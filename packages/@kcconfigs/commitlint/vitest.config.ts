import { defineProjectConfig } from "@kcconfigs/vitest";
import { useMockPlugin } from "@kcconfigs/vitest/plugins";

export default defineProjectConfig(
	useMockPlugin({
		flags: {
			fs: true,
			fsPromises: true,
			process: true,
			os: true,
		},
	}),
);
