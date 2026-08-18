import type { ZodType, z } from "zod";
import type { RawConfig } from "../../types";
import { ZconfigValidationError } from "../errors";

/**
 * Parses an already merged configuration against its schema.
 *
 * Merging stays with the caller so the load pipeline reads in one place; this
 * only turns a Zod failure into the package's own typed error.
 *
 * @param schema - schema describing the expected configuration
 * @param config - merged configuration from every adapter
 * @returns the parsed configuration, with schema defaults resolved
 * @throws {ZconfigValidationError} when the configuration is invalid
 * @internal
 */
const validateConfig = <S extends ZodType>(
	schema: S,
	config: RawConfig,
): z.output<S> => {
	const result = schema.safeParse(config);
	if (!result.success) throw new ZconfigValidationError(result.error);

	return result.data;
};

export default validateConfig;
