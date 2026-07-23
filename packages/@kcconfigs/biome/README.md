# Biome shared configuration

Shared Biome formatter and linter settings.

## Usage

Add a `biome.json` (or `biome.jsonc`) that extends the default preset:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "extends": ["@kcconfigs/biome"]
}
```

The default preset extends the base rules and excludes generated artifacts such as `dist`, coverage, and test reports.
See [biome.default.json](./src/presets/default.json) for the full list.

## Variants

- `@kcconfigs/biome`: extends the base preset and adds sensible file includes/excludes plus editorconfig awareness.
- `@kcconfigs/biome/base`: bare preset containing formatter, linter, and assist rules without workspace-specific file filters; useful if you want custom include/exclude patterns.

Example using the base preset with custom overrides:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
  "extends": ["@kcconfigs/biome/base"],
  "files": { "includes": ["src/**/*.ts", "tests/**/*.ts"] },
  "linter": {
    "rules": {
      "complexity": {
        "noUselessSwitchCase": "warn"
      }
    }
  }
}
```
