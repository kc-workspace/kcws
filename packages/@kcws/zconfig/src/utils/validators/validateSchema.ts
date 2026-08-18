import type { ZodType } from "zod";
import { visit } from "./utils";

/**
 * Asserts that every key reachable in a schema is strict camelCase.
 *
 * Runs before any adapter, so a malformed schema fails without performing I/O.
 * The rule is enforced for all schemas rather than only when `envAdapter` is
 * present — otherwise adding that adapter later would retroactively invalidate
 * a working schema.
 *
 * @param schema - schema describing the expected configuration
 * @throws {ZconfigSchemaError} on the first offending key
 * @internal
 */
const validateSchema = (schema: ZodType): void => {
	visit(schema, [], new Set());
};

export default validateSchema;
