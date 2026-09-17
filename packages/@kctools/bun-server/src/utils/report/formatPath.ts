import { relative } from "node:path";

const formatPath = (path: string, cwd: string): string => {
	const short = relative(cwd, path);
	return short === "" || short.startsWith("..") ? path : short;
};

export default formatPath;
