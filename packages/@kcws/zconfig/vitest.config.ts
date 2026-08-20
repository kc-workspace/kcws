import { defineProjectConfig } from "@kcconfigs/vitest";
import {
	debugPlugin,
	overridePlugin,
	useMockPlugin,
} from "@kcconfigs/vitest/plugins";

export default defineProjectConfig(
	overridePlugin({
		printConsoleTrace: true,
	}),
	debugPlugin(),
	useMockPlugin({ flags: { fs: true, fsPromises: true } }),
);
