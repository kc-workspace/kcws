import { join } from "node:path";

import { readJsonFile } from "@nx/devkit";

export const hasGenerator = (name: string, root: string) => {
  type PackageJson = { generators?: string };
  const packages = readJsonFile<PackageJson>(join(root, "package.json"));
  if (packages.generators?.length <= 0) {
    return false;
  }

  type GeneratorsJson = { generators?: Record<string, unknown> };
  const { generators } = readJsonFile<GeneratorsJson>(
    join(root, packages.generators)
  );

  return (generators?.[name] ?? undefined) !== undefined;
};
