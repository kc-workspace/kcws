/** Milliseconds per second. */
const SECOND = 1000;

/** Decimals kept for every unit above milliseconds. */
const DECIMALS = 2;

/**
 * Format an elapsed duration, switching to seconds past one second.
 *
 * @param ms - duration in milliseconds
 * @returns the duration and its unit, e.g. `231ms`
 */
const formatDuration = (ms: number): string => {
	if (!Number.isFinite(ms) || ms <= 0) return "0ms";
	return ms < SECOND
		? `${Math.round(ms)}ms`
		: `${(ms / SECOND).toFixed(DECIMALS)}s`;
};
export default formatDuration;
