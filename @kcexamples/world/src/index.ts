export const getName = (name?: string): string => {
	return name ?? "world"
}

export { name as PKG_NAME, version as PKG_VERSION } from "../package.json"
