#!/usr/bin/env bun

import { clean } from "./utils/clean"

async function main() {
	await clean(["dist"])
}

void main()
