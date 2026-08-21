import { ZconfigAdapterError } from "../errors";

const importAsync = async <T>(
	adapter: string,
	moduleName: string,
): Promise<T> => {
	try {
		return await import(moduleName);
	} catch (cause) {
		throw new ZconfigAdapterError(
			adapter,
			`cannot resolve "${moduleName}"; install it to use this adapter`,
			cause,
		);
	}
};

export default importAsync;
