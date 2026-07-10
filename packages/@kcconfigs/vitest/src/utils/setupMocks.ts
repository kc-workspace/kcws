import { join } from "node:path";

export interface MockFlag {
	fs?: true;
	fsPromises?: true;
	process?: true;
	os?: true;
	console?: true;
}

export type MockFlagKey = keyof MockFlag;

const resolvePath = (name: string) => {
	// import.meta.dirname is resolved to `dist` directory
	return join(import.meta.dirname, "..", "__mocks__", `${name}.ts`);
};

export const setupMocks = (flag: MockFlag): string[] => {
	const keys = Object.keys(flag) as MockFlagKey[];
	return keys
		.map((key) => (flag[key] === true ? resolvePath(key) : undefined))
		.filter((path) => path !== undefined);
};
