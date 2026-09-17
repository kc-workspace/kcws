import { KIND_ORDER } from "./constants";
import formatKind from "./formatKind";
import formatPath from "./formatPath";
import formatSize from "./formatSize";
import type { ReportedFile } from "./types";

const reportArtifacts = function* (
	cwd: string,
	artifacts: ReportedFile[],
): Generator<string, undefined, void> {
	const rows = artifacts.sort(compare).map((artifact) => ({
		path: formatPath(artifact.path, cwd),
		size: formatSize(artifact.size),
		kind: formatKind(artifact.kind),
	}));

	const pathWidth = Math.max(0, ...rows.map((row) => row.path.length));
	const sizeWidth = Math.max(0, ...rows.map((row) => row.size.length));

	for (const row of rows) {
		yield `${row.path.padEnd(pathWidth)}  ${row.size.padStart(sizeWidth)}  ${row.kind}`;
	}
};

const kindRank = (kind: string): number => {
	const index = KIND_ORDER.indexOf(kind);
	return index === -1 ? KIND_ORDER.length : index;
};

/** Entrypoints first, then by kind, then alphabetically inside a kind. */
const compare = (a: ReportedFile, b: ReportedFile): number =>
	kindRank(a.kind) - kindRank(b.kind) || a.path.localeCompare(b.path);

export default reportArtifacts;
