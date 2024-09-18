import { join } from "node:path";

import {
  names,
  readJsonFile,
  readProjectConfiguration,
  updateJson,
  writeJson,
  type Tree,
} from "@nx/devkit";

import { determineArtifactNameAndDirectoryOptions } from "@nx/devkit/src/generators/artifact-name-and-directory-utils";

export const createAndUpdateGeneratorsJson = (
  tree: Tree,
  generator: GeneratorInformation
) => {
  updateJson<PackageJson>(tree, generator.pkgFile, json => {
    json.generators ??= "./generators.json";
    return json;
  });

  if (!generator.jsonExist) {
    writeJson<GeneratorsJson>(tree, generator.jsonFile, {
      generators: {},
    });
  }

  const baseSrc = join(".", "src", "generators", generator.fileName);
  updateJson<GeneratorsJson>(tree, generator.jsonFile, json => {
    json.generators[generator.fileName] = {
      factory: join(baseSrc, "generator"),
      schema: join(baseSrc, "schema.json"),
      description: `${generator.name} generator`,
    };

    return json;
  });
};

interface PackageJson {
  generators?: string;
}

interface GeneratorsJson {
  generators?: Record<string, unknown>;
}
interface GeneratorsJsonInformation {
  pkgPath: string;

  fileExist: boolean;
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

  jsonExist: boolean;
  jsonFile: string;

  pkgFile: string;
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

  const generator = getGeneratorJson(tree, pluginRoot);
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

    pkgFile: generator?.pkgPath,
    jsonFile: generator?.filepath,
    jsonExist: generator?.fileExist,
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
  tree: Tree,
  root: string
): GeneratorsJsonInformation | undefined => {
  const pkgPath = join(root, "package.json");
  if (!tree.exists(pkgPath)) return undefined;

  const packages = readJsonFile<PackageJson>(pkgPath);
  if (packages.generators?.length <= 0) {
    return undefined;
  }

  const filepath = join(root, packages.generators);
  if (!tree.exists(filepath))
    return { fileExist: false, pkgPath, filepath, content: {} };

  const { generators } = readJsonFile<GeneratorsJson>(filepath);
  return { fileExist: true, pkgPath, filepath, content: generators };
};
