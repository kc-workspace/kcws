export const hello = (name = "Bun Monorepo") => {
	return `Hello, ${name}!`
}

export { name as PKG_NAME, version as PKG_VERSION } from "../package.json"
