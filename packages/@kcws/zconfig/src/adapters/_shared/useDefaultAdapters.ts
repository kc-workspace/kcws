import type { Adapter } from "#types";
import { encodeEnvKey } from "#utils/env";
import { dotenvAdapter } from "../dotenv";
import { getDotenvFiles } from "../dotenv/utils";
import { envAdapter } from "../env";
import { getJsonFiles, jsonAdapter } from "../json";
import { getTomlFiles, tomlAdapter } from "../toml";
import { getYamlFiles, yamlAdapter } from "../yaml";

const useDefaultAdapters = (name: string): Adapter[] => {
	const prefix = encodeEnvKey([name], undefined, "");
	return [
		jsonAdapter({ optional: true, jsonc: true, files: getJsonFiles(name) }),
		yamlAdapter({ optional: true, files: getYamlFiles(name) }),
		tomlAdapter({ optional: true, files: getTomlFiles(name) }),
		dotenvAdapter({ optional: true, files: getDotenvFiles(name), prefix }),
		envAdapter({ prefix }),
	];
};

export default useDefaultAdapters;
