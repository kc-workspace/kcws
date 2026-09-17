import { getEnv, toBool } from "#utils/env";

const isDebug = (): boolean => {
	return getEnv("DEBUG", toBool) ?? false;
};

export default isDebug;
