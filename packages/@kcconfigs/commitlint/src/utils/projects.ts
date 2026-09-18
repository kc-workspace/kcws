import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { cwd as wd } from "node:process";
import { findWorkspacePackagesNoCheck } from "@pnpm/workspace.find-packages";
import { parse } from "yaml";

const findPackages = async (
	cwd: string,
	patterns: WithUndefined<string[]>,
	includeRoot: WithUndefined<boolean>,
) => {
	const packages = await findWorkspacePackagesNoCheck(cwd, {
		patterns: patterns ?? ["**"],
	});

	return packages
		.filter((pkg) => (includeRoot ?? false) || pkg.rootDir !== cwd)
		.map((pkg) => pkg.manifest.name ?? basename(pkg.rootDirRealPath))
		.map((name) => (name.startsWith("@") ? name.slice(1) : name));
};

export const findPnpmPackages = async (
	includeRoot?: boolean,
): Promise<string[]> => {
	const cwd = wd();

	const pnpmWorkspace = await readFile(join(cwd, "pnpm-workspace.yaml"), {
		encoding: "utf8",
	});

	const workspace = parse(pnpmWorkspace);
	return findPackages(cwd, workspace?.packages, includeRoot);
};

export const findNpmPackages = async (
	includeRoot?: boolean,
): Promise<string[]> => {
	const cwd = wd();

	const { workspaces } = JSON.parse(
		await readFile(join(cwd, "package.json"), {
			encoding: "utf8",
		}),
	);
	return findPackages(cwd, workspaces, includeRoot);
};

export const findBunPackages = async (
	includeRoot?: boolean,
): Promise<string[]> => {
	return findNpmPackages(includeRoot);
};
