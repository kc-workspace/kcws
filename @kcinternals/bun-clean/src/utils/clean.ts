import { exists, rm } from "node:fs/promises"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const getBasePath = () => {
	return pathToFileURL(".").pathname
}

export const clean = async (toBeCleans: string[], basePath?: string) => {
	await Promise.all(
		toBeCleans.map(async (name) => {
			const path = join(basePath ?? getBasePath(), name)
			const existed = await exists(path)
			if (existed) {
				console.info(`Removing... ${path}`)
				await rm(path, { recursive: true, force: true })
			}
		}),
	)
}
