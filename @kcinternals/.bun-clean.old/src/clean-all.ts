#!/usr/bin/env bun

import { clean } from "./utils/clean"

async function main() {
	await clean(["dist", "node_modules", "bun.lock", "bun.lockb"])
}

void main()
