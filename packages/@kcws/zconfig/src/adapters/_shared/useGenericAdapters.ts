import type { Adapter } from "#types";
import { autoAdapter } from "../auto";
import { dotenvAdapter } from "../dotenv";
import { envAdapter } from "../env";

const genericAdapters = [
	autoAdapter({ optional: true }),
	dotenvAdapter({ optional: true }),
	envAdapter(),
];

const useGenericAdapters = (): Adapter[] => {
	return genericAdapters;
};
export default useGenericAdapters;
