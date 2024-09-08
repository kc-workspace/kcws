/// <reference types='vitest' />

import { join } from "node:path";
import { defineConfig } from "vite";

import dts from "vite-plugin-dts";
import { coverageConfigDefaults } from "vitest/config";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

const rootDir = "../..";
const currentPackage = "packages/hello";

export default defineConfig({
  root: __dirname,
  cacheDir: join(rootDir, "node_modules", ".vite", currentPackage),

  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: "src",
      tsconfigPath: join(__dirname, "tsconfig.lib.json"),
    }),
  ],

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: join(rootDir, "dist", currentPackage),
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: "src/index.ts",
      name: "hello",
      fileName: "index",
      formats: ["cjs", "es", "umd"],
    },
    rollupOptions: {
      // Never bundle anything
      external: id => {
        if (id.includes(currentPackage)) return false;
        if (id.startsWith("./")) return false;
        return true;
      },
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default", "html", "junit"],
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "html", "lcovonly"],
      include: ["src/**"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "src/index.ts", // index.ts should not contains any logic
      ],
      all: true,
    },
  },
});
