/** Byte units used when formatting a size, smallest first. */
const UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

/** Bytes per unit step. */
const STEP = 1024;

/** Decimals kept for every unit above plain bytes. */
const DECIMALS = 2;

/**
 * Format a byte count with the largest unit that keeps it above `1`.
 *
 * Plain bytes stay whole; anything larger is rounded to two decimals, so a
 * column of sizes lines up regardless of unit.
 *
 * @param bytes - size to format
 * @returns the size and its unit, e.g. `1.21 KB`
 */
const formatSize = (bytes: number): string => {
	if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

	let exponent = Math.min(
		Math.floor(Math.log(bytes) / Math.log(STEP)),
		UNITS.length - 1,
	);
	let value = bytes / STEP ** exponent;

	// rounding can push a value back onto the next unit, e.g. 1048575 bytes is
	// 1023.999 KB before rounding and 1024.00 KB after it
	if (Number(value.toFixed(DECIMALS)) >= STEP && exponent < UNITS.length - 1) {
		exponent++;
		value = bytes / STEP ** exponent;
	}

	return exponent === 0
		? `${value} ${UNITS[0]}`
		: `${value.toFixed(DECIMALS)} ${UNITS[exponent]}`;
};

export default formatSize;
