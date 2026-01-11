#!/usr/bin/env bash

set -euo pipefail

## Utilize Release-As commit and force package next version.
## Usage:
## ./scripts/force-version.sh <name> <version>
## Arguments:
##   name                  - name of the package to prepare first release (e.g. @kcconfigs/biome)
##   version               - version to be release next (e.g. 0.1.0)

NAME="${1:?name of the package is required as the first argument}"
VERSION="${2:?version is required as the second argument}"

TEMP_DIR="$(mktemp -d)"

command -v jq >/dev/null 2>&1 || {
  echo "jq is required but not installed. Please install jq first."
  exit 1
}

__exec() {
  local name="$1"
  shift

  pnpm --filter "$name" exec "$@"
}

main() {
  local cwd name="$NAME" previous next="$VERSION"
  cwd="$(__exec "$name" pwd)"
  previous="$(jq -r .version "$cwd/package.json")"

  local pkg_name="package.json"
  local pkg="$cwd/$pkg_name"

  # __exec jq ".version = \"$VERSION\"" package.json
  echo "$name: Update $pkg_name (v$previous -> v$next)"

  jq --arg version "$next" '.version = $version' "$pkg" >"$TEMP_DIR/$pkg_name"
  mv "$TEMP_DIR/$pkg_name" "$pkg"

  echo "$name: Commit $pkg_name... (enter to continue)"
  read -r _

  git add "$pkg"
  git commit -m "chore(${name//@/}): force update v$previous => v$next

Release-As: $next"
}

main
