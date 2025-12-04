import type { PackageBuild } from "./pkg.types"
import { mkdir, rm } from "node:fs/promises"
import { join, relative as relativePath, resolve } from "node:path"
import { pathToFileURL } from "bun"

export const ROOT = resolve(import.meta.dir, "..", "..")

export const path = (...paths: string[]) =>
	pathToFileURL(join(...paths)).pathname

export const relative = (...paths: string[]) =>
	relativePath(ROOT, path(...paths))

export const ensureDir = async (dirpath: string) => {
	const directory = path(dirpath)
	await rm(directory, { recursive: true, force: true, maxRetries: 3 })
	await mkdir(directory, { recursive: true, mode: 0o755 })
}

export const copyFiles = async (build: PackageBuild, files: string[]) => {
	await Promise.all(
		files.map(async (file) => {
			const src = Bun.file(path(file))
			try {
				const dest = path(build.outdir, file)
				await Bun.write(dest, src, {
					createPath: true,
				})
			} catch (error) {
				const { code } = error as { code: string }

				const ignoreErrors = ["ENOENT"]
				if (!ignoreErrors.includes(code)) console.error(error)
			}
		}),
	)
}
