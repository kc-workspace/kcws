import { join } from "node:path";

import {
  names,
  readJsonFile,
  readProjectConfiguration,
  type Tree,
} from "@nx/devkit";

import { determineArtifactNameAndDirectoryOptions } from "@nx/devkit/src/generators/artifact-name-and-directory-utils";

interface PackageJson {
  generators?: string;
}

interface GeneratorsJson {
  generators?: Record<string, unknown>;
}
interface GeneratorsJsonInformation {
  filepath: string;
  content: GeneratorsJson;
}

export interface GeneratorOptions {
  name: string;
  plugin: string;
}

export interface GeneratorInformation {
  pluginName: string;
  pluginRoot: string;
  pluginSourceRoot: string;

  name: string;
  fileName: string;
  propertyName: string;
  className: string;
  directory: string;

  jsonFile: string;
}

export const getGeneratorInformation = async (
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorInformation> => {
  // Get generator name
  const { name, fileName, propertyName, className } = names(options.name);

  // Read plugin configuration
  const {
    name: pluginName,
    root: pluginRoot,
    sourceRoot: pluginSourceRoot,
  } = readProjectConfiguration(tree, options.plugin);

  const generator = getGeneratorJson(pluginRoot);
  if (generator?.content?.generators?.[fileName] !== undefined) {
    throw new Error(`Generator '${fileName}' existed on '${pluginName}'`);
  }

  // Build generator information
  const { directory } = await determineArtifactNameAndDirectoryOptions(tree, {
    name: name,
    nameAndDirectoryFormat: "as-provided",
    artifactType: "generator",
    callingGenerator: "@kcinternals/nx-plugins:generator",
    project: pluginName,
    directory: join(pluginSourceRoot, "generators", fileName),
  });

  return {
    pluginName,
    pluginRoot,
    pluginSourceRoot,

    name,
    fileName,
    propertyName,
    className,
    directory,
    jsonFile: generator.filepath,
  };
};

export interface TemplateFileOptions {
  name: string;
  description?: string;
  plugin: string;
  extra: object;
}

export const getTemplateFilesOptions = (
  generator: GeneratorInformation,
  options: TemplateFileOptions
) => {
  return {
    name: options.name,
    description: options.description,
    plugin: options.plugin,
    ...options.extra,
    generator: {
      fnName: `${generator.propertyName}Generator`,
    },
    schema: {
      id: generator.className,
      description: options.description,
      interface: `${generator.className}GeneratorSchema`,
    },
  };
};

export const getGeneratorJson = (
  root: string
): GeneratorsJsonInformation | undefined => {
  const packages = readJsonFile<PackageJson>(join(root, "package.json"));
  if (packages.generators?.length <= 0) {
    return undefined;
  }

  const filepath = join(root, packages.generators);
  const { generators } = readJsonFile<GeneratorsJson>(filepath);

  return {
    filepath,
    content: generators,
  };
};
