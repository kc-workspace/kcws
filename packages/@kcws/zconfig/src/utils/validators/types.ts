/**
 * Minimal view of Zod's internals.
 *
 * Zod exposes no public traversal API, so the schema walk reads `_zod.def`
 * directly. Only the discriminator is typed; each branch casts the fields it
 * needs, which keeps the unavoidable unsafety local to the walker.
 *
 * @internal
 */
export interface SchemaLike {
	_zod?: { def?: SchemaDef };
}

/**
 * A schema definition, keyed by its `type` discriminator.
 *
 * @internal
 */
export type SchemaDef = { type?: string } & Record<string, unknown>;
