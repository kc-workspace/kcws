import { relative } from "node:path";
import type * as Bun from "bun";

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
export const formatSize = (bytes: number): string => {
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

/** Milliseconds per second. */
const SECOND = 1000;

/**
 * Format an elapsed duration, switching to seconds past one second.
 *
 * @param ms - duration in milliseconds
 * @returns the duration and its unit, e.g. `231ms`
 */
export const formatDuration = (ms: number): string => {
	if (!Number.isFinite(ms) || ms <= 0) return "0ms";
	return ms < SECOND
		? `${Math.round(ms)}ms`
		: `${(ms / SECOND).toFixed(DECIMALS)}s`;
};

/** Artifact kinds in the order they are reported. */
const KIND_ORDER: Bun.BuildArtifact["kind"][] = [
	"entry-point",
	"chunk",
	"asset",
	"sourcemap",
	"bytecode",
];

/** Shorter labels for the kinds Bun reports. */
const KIND_LABEL: Record<Bun.BuildArtifact["kind"], string> = {
	"entry-point": "entry",
	chunk: "chunk",
	asset: "asset",
	sourcemap: "sourcemap",
	bytecode: "bytecode",
};

/** Indentation of every reported line. */
const INDENT = "  ";

/** Spaces between the columns of a reported line. */
const GAP = "  ";

const kindRank = (kind: Bun.BuildArtifact["kind"]): number => {
	const index = KIND_ORDER.indexOf(kind);
	return index === -1 ? KIND_ORDER.length : index;
};

/** Entrypoints first, then by kind, then alphabetically inside a kind. */
const compare = (a: Bun.BuildArtifact, b: Bun.BuildArtifact): number =>
	kindRank(a.kind) - kindRank(b.kind) || a.path.localeCompare(b.path);

/**
 * Shorten an artifact path against the reported directory.
 *
 * A path outside the directory keeps its absolute form: a chain of `../` is
 * both longer and harder to read than the path it replaces.
 *
 * @param path - absolute path of the artifact
 * @param cwd - directory the paths are reported against
 * @returns the relative path, or the absolute one when it escapes `cwd`
 */
const shorten = (path: string, cwd: string): string => {
	const short = relative(cwd, path);
	return short === "" || short.startsWith("..") ? path : short;
};

/**
 * Render one line per built file: path, size, and kind.
 *
 * Paths are relative to `cwd` so the output stays readable, and the columns are
 * padded to the widest value to keep the sizes aligned.
 *
 * @param artifacts - files the bundler wrote
 * @param cwd - directory the paths are reported against
 * @returns one line per artifact, sorted with the entrypoints first
 */
export const formatArtifacts = (
	artifacts: Bun.BuildArtifact[],
	cwd: string,
): string[] => {
	const rows = [...artifacts].sort(compare).map((artifact) => ({
		path: shorten(artifact.path, cwd),
		size: formatSize(artifact.size),
		kind: KIND_LABEL[artifact.kind] ?? artifact.kind,
	}));

	const pathWidth = Math.max(0, ...rows.map((row) => row.path.length));
	const sizeWidth = Math.max(0, ...rows.map((row) => row.size.length));

	return rows.map(
		(row) =>
			`${INDENT}${row.path.padEnd(pathWidth)}${GAP}${row.size.padStart(sizeWidth)}${GAP}${row.kind}`,
	);
};

/**
 * Render the closing line of a build: file count, total size, elapsed time.
 *
 * @param artifacts - files the bundler wrote
 * @param elapsed - build duration in milliseconds
 * @returns a single summary line
 */
export const formatSummary = (
	artifacts: Bun.BuildArtifact[],
	elapsed: number,
): string => {
	const total = artifacts.reduce((sum, artifact) => sum + artifact.size, 0);
	const files = `${artifacts.length} ${artifacts.length === 1 ? "file" : "files"}`;
	return `${INDENT}${files}, ${formatSize(total)} in ${formatDuration(elapsed)}`;
};

/**
 * Render a bundler message, appending its source location when it has one.
 *
 * @param message - message reported by the bundler
 * @returns a single line, e.g. `error: BuildMessage - failed (src/app.ts:3:1)`
 */
export const formatMessage = (
	message: Bun.BuildOutput["logs"][number],
): string => {
	const line = `${message.level}: ${message.name} - ${message.message}`;
	const position = message.position;
	if (position === null || position === undefined) return line;
	return `${line} (${position.file}:${position.line}:${position.column})`;
};
