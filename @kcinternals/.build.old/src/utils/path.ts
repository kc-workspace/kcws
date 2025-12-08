import { join } from "node:path"
import { pathToFileURL } from "node:url"

export const toAbsPath = (...relatives: string[]): string => {
	return pathToFileURL(join(...relatives)).pathname
}
