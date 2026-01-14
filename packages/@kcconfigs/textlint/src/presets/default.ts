import type { UserConfig } from "../models/config";
import { allowlist, comments, terminology } from "../rules";
import { defineConfig } from "../utils/defineConfig";

const config: UserConfig = defineConfig(
	comments(true),
	allowlist(),
	terminology(),
);

export = config;
