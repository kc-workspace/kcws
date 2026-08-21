import type { Adapter } from "#types";
import { dotenvAdapter } from "../dotenv";
import { envAdapter } from "../env";
import { jsonAdapter } from "../json";
import { tomlAdapter } from "../toml";
import { yamlAdapter } from "../yaml";

const genericAdapters = [
	jsonAdapter({ optional: true }),
	yamlAdapter({ optional: true }),
	tomlAdapter({ optional: true }),
	dotenvAdapter({ optional: true }),
	envAdapter(),
];

const useGenericAdapters = (): Adapter[] => {
	return genericAdapters;
};
export default useGenericAdapters;
