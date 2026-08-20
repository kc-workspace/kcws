import type { Adapter } from "#types";
import {
	dotenvAdapter,
	envAdapter,
	jsonAdapter,
	yamlAdapter,
} from "../adapters";

export const DEF_ADAPTERS: Adapter[] = [
	jsonAdapter({ jsonc: true }),
	yamlAdapter(),
	dotenvAdapter(),
	envAdapter(),
];
