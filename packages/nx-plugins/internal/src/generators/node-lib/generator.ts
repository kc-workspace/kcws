import { join } from "node:path";

import {
  formatFiles,
  generateFiles,
  Tree,
  names,
  readProjectConfiguration,
} from "@nx/devkit";
import { determineArtifactNameAndDirectoryOptions } from "@nx/devkit/src/generators/artifact-name-and-directory-utils";

import type { NodeLibGeneratorSchema } from "./schema";

export async function nodeLibGenerator(
  tree: Tree,
  options: NodeLibGeneratorSchema
) {
  const { name, fileName } = names(options.name);

  const { name: pluginName, sourceRoot: pluginRoot } = readProjectConfiguration(
    tree,
    options.plugin ?? "nx-plugin-internal"
  );

  const {
    project,
    directory,
    filePath: outputPath,
    fileName: outputName,
  } = await determineArtifactNameAndDirectoryOptions(tree, {
    name: name,
    nameAndDirectoryFormat: "as-provided",
    artifactType: "generator",
    callingGenerator: "@kcinternals/nx-plugins:generator",
    project: pluginName,
    directory: join(pluginRoot, "src", "generators", fileName),
  });

  console.log(project);
  console.log(directory);
  console.log(outputName);
  console.log(outputPath);

  // addProjectConfiguration(tree, name, {
  //   root: projectRoot,
  //   sourceRoot: `${projectRoot}/src`,
  //   projectType: "library",
  //   targets: {},
  // });

  // generateFiles(tree, join(__dirname, "files"), projectRoot, {
  //   ...options,
  //   templates: {
  //     name: "<%= name %>",
  //   },
  //   schema: {
  //     id: "",
  //   },
  // });
  // await formatFiles(tree);
}

export default nodeLibGenerator;
