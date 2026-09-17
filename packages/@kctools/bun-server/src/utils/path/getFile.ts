import type { BunFile } from "bun";
import type { BunType } from "#types";

const getFile = async (
	Bun: BunType,
	path: string,
): Promise<BunFile | undefined> => {
	const file = Bun.file(path);
	return (await file.exists()) ? file : undefined;
};

export default getFile;
