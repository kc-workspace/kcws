import type { Adapter } from "#types";
import { envAdapter, jsonAdapter, yamlAdapter } from "../adapters";

export const DEF_ADAPTERS: Adapter[] = [
	jsonAdapter({ jsonc: true }),
	yamlAdapter(),
	envAdapter(),
];
