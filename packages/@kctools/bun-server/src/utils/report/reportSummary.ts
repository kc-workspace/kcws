import formatDuration from "./formatDuration";
import formatSize from "./formatSize";
import type { ReportedFile } from "./types";

const reportSummary = (elapsed: number, artifacts: ReportedFile[]): string => {
	const total = artifacts.reduce((sum, artifact) => sum + artifact.size, 0);
	const files = `${artifacts.length} ${artifacts.length === 1 ? "file" : "files"}`;
	return `${files}, ${formatSize(total)} in ${formatDuration(elapsed)}`;
};

export default reportSummary;
