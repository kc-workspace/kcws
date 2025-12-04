import { build } from "./bun"
import { loadPackage } from "./package"

async function main() {
	try {
		const pkg = await loadPackage()
		await build(pkg)
	} catch (e) {
		const error = e as Error
		console.error(`Build failed:`, error.name, error.message)
		process.exit(1)
	}
}

void main()
