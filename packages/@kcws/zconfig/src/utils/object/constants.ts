/**
 * Keys that must never be written into a configuration object.
 *
 * Config files are untrusted input, and both `JSON.parse` and YAML parsers can
 * produce a literal `__proto__` own property. Assigning it would walk the
 * prototype setter and pollute `Object.prototype` process-wide.
 *
 * @internal
 */
export const DANGEROUS_KEYS: ReadonlySet<string> = new Set([
	"__proto__",
	"constructor",
	"prototype",
]);
