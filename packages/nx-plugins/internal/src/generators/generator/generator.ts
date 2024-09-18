import type { GeneratorGeneratorSchema } from "./schema";

import { join } from "node:path";
import { formatFiles, generateFiles, type Tree } from "@nx/devkit";

import {
  getGeneratorInformation,
  getTemplateFilesOptions,
} from "../../utils/generators";

export async function generatorGenerator(
  tree: Tree,
  options: GeneratorGeneratorSchema
) {
  const plugin = options.plugin ?? "nx-plugin-internal";
  const generator = await getGeneratorInformation(tree, {
    name: options.name,
    plugin: plugin,
  });

  const template = join(__dirname, "files");
  const templateOptions = getTemplateFilesOptions(generator, {
    name: options.name,
    description: options.description,
    plugin: plugin,
    extra: options,
  });

  // Update generators.json file
  console.log(JSON.stringify(generator, null, "  "));

  // Create generator files
  generateFiles(tree, template, generator.directory, templateOptions);
  const templatePath = join(generator.directory, "files/src/index.ts.template");
  tree.write(templatePath, 'const variable = "<%= name %>";');

  await formatFiles(tree);
}

export default generatorGenerator;
