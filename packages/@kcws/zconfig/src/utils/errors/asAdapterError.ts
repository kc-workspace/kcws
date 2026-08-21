import type { Adapter } from "#types";
import { ZconfigAdapterError } from "./errors";

/**
 * Normalises anything an adapter throws into a {@link ZconfigAdapterError}.
 *
 * An adapter that already reported a typed failure — a missing file, an absent
 * format library — is passed through untouched so its message survives. Every
 * other value is wrapped, so no raw error ever escapes this package.
 */
const asAdapterError = (
	adapter: Adapter,
	cause: unknown,
): ZconfigAdapterError => {
	if (cause instanceof ZconfigAdapterError) return cause;

	const detail = cause instanceof Error ? cause.message : String(cause);
	return new ZconfigAdapterError(adapter.name, detail, cause);
};
export default asAdapterError;
