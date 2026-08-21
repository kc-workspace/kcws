import { ZconfigAdapterError } from "./errors";

const toAdapterError = (
	name: string,
	message: string,
	cause: unknown,
): ZconfigAdapterError => {
	if (cause instanceof ZconfigAdapterError) return cause;
	return new ZconfigAdapterError(name, message, cause);
};
export default toAdapterError;
