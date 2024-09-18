import type { GeneratorGeneratorSchema } from "./schema";

import { join } from "node:path";

import {
  Tree,
  generateFiles,
  names,
  readProjectConfiguration,
} from "@nx/devkit";
import { determineArtifactNameAndDirectoryOptions } from "@nx/devkit/src/generators/artifact-name-and-directory-utils";

import { hasGenerator } from "../../utils/generators";

export async function generatorGenerator(
  tree: Tree,
  options: GeneratorGeneratorSchema
) {
  const { name, fileName, propertyName, className } = names(options.name);

  const {
    name: pluginName,
    root: pluginRoot,
    sourceRoot: pluginSourceRoot,
  } = readProjectConfiguration(tree, options.plugin ?? "nx-plugin-internal");

  if (hasGenerator(fileName, pluginRoot)) {
    throw new Error(`Generator '${fileName}' existed on '${pluginName}'`);
  }

  const { directory, filePath: outputPath } =
    await determineArtifactNameAndDirectoryOptions(tree, {
      name: name,
      nameAndDirectoryFormat: "as-provided",
      artifactType: "generator",
      callingGenerator: "@kcinternals/nx-plugins:generator",
      project: pluginName,
      directory: join(pluginSourceRoot, "generators", fileName),
      fileName: "generator",
    });

  const templatePath = join(directory, "files/src/index.ts.template");
  tree.write(templatePath, 'const variable = "<%= name %>";');

  generateFiles(tree, join(__dirname, "files"), directory, {
    ...options,
    generatorFnName: `${propertyName}Generator`,
    schema: {
      id: className,
      interface: `${className}GeneratorSchema`,
    },
  });

  console.log(directory);
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

// function addFiles(host: Tree, options: NormalizedSchema) {
//   const indexPath = join(options.directory, "files/src/index.ts.template");

//   if (!host.exists(indexPath)) {
//     host.write(indexPath, 'const variable = "<%= name %>";');
//   }

//   generateFiles(host, join(__dirname, "./files/generator"), options.directory, {
//     ...options,
//     generatorFnName: `${options.propertyName}Generator`,
//     schemaInterfaceName: `${options.className}GeneratorSchema`,
//   });

//   if (options.unitTestRunner === "none") {
//     host.delete(join(options.directory, `generator.spec.ts`));
//   }
// }

export default generatorGenerator;
