import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";

import { nodeLibGenerator } from "./generator";
import { NodeLibGeneratorSchema } from "./schema";

describe("node-lib generator", () => {
  let tree: Tree;
  const options: NodeLibGeneratorSchema = { name: "test" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await nodeLibGenerator(tree, options);
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
