import { join } from "node:path";
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from "@nx/devkit";

import type { WebLibGeneratorSchema } from "./schema";

export async function webLibGenerator(
  tree: Tree,
  options: WebLibGeneratorSchema
) {
  const projectRoot = join("packages", options.name);
  const sourceRoot = join(projectRoot, "src");
  const templateRoot = join(__dirname, "files");

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    sourceRoot: sourceRoot,
    projectType: "library",
    metadata: {
      description: options.description,
      technologies: ["nodejs", "javascript", "typescript"],
    },
    targets: {
      lint: {
        executor: "@kcinternals/nx-plugin:lint",
      },
      build: {
        executor: "@kcinternals/nx-plugin:build",
      },
      test: {
        executor: "@kcinternals/nx-plugin:test",
      },
    },
  });

  generateFiles(tree, templateRoot, projectRoot, options);
  await formatFiles(tree);
}

export default webLibGenerator;
