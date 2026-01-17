import { allowlist } from "../filters/allowlist";
import { comments } from "../filters/comment";
import type { AnyUserConfig } from "../models";
import { terminology } from "../rules/terminology";
import { defineConfig } from "../utils/defineConfig";

const config: AnyUserConfig = defineConfig({
	presets: [],
	rules: [terminology()],
	filters: [comments(), allowlist({ allow: [""] })],
	plugins: [],
});

export default config;
