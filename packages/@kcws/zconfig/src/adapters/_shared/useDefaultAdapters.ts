import type { Adapter } from "#types";
import { encodeEnvKey } from "#utils/env";
import { autoAdapter, getAutoFiles } from "../auto";
import { dotenvAdapter } from "../dotenv";
import { getDotenvFiles } from "../dotenv/utils";
import { envAdapter } from "../env";

const useDefaultAdapters = (name: string): Adapter[] => {
	const prefix = encodeEnvKey([name], undefined, "");
	return [
		autoAdapter({ optional: true, files: getAutoFiles(name) }),
		dotenvAdapter({ optional: true, files: getDotenvFiles(name), prefix }),
		envAdapter({ prefix }),
	];
};

export default useDefaultAdapters;
