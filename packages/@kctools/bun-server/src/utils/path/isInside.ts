import { isAbsolute, relative } from "node:path";

const isInside = (parent: string, child: string): boolean => {
	const path = relative(parent, child);
	return path === "" || (!path.startsWith("..") && !isAbsolute(path));
};

export default isInside;
