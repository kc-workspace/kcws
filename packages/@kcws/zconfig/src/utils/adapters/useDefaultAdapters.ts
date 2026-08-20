import type { Adapter } from "#types";
import {
	dotenvAdapter,
	envAdapter,
	jsonAdapter,
	yamlAdapter,
} from "../../adapters";

const useDefaultAdapters = (): Adapter[] => {
	return [
		jsonAdapter({ jsonc: true }),
		yamlAdapter(),
		dotenvAdapter(),
		envAdapter(),
	];
};

export default useDefaultAdapters;
