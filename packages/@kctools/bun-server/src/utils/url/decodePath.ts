/**
 * Decode a request pathname, rejecting what cannot become a file path.
 *
 * @param url - the requested URL
 * @returns the decoded pathname, or `undefined` when it is unusable
 */
const decodePath = (url: string): string | undefined => {
	try {
		const pathname = decodeURIComponent(new URL(url).pathname);
		return pathname.includes("\0") ? undefined : pathname;
	} catch {
		// malformed percent encoding
		return undefined;
	}
};

export default decodePath;
