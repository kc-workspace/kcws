import type { Adapter } from "#types";
import { encodeEnvKey } from "#utils/env";
import { dotenvAdapter } from "../dotenv";
import { getDotenvFiles } from "../dotenv/utils";
import { envAdapter } from "../env";

const useEnvOnlyAdapters = (name: string): Adapter[] => {
	const prefix = encodeEnvKey([name], undefined, "");
	return [
		dotenvAdapter({ optional: true, files: getDotenvFiles(name), prefix }),
		envAdapter({ prefix }),
	];
};

export default useEnvOnlyAdapters;
