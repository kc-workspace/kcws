/**
 * A file worth a line in the build report.
 */
export interface ReportedFile {
	/** Absolute path the file was written to. */
	path: string;
	/** Size of the file in bytes. */
	size: number;
	/** What the file is, reported as it is when Bun does not produce it. */
	kind: string;
}
