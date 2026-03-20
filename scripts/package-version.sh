#!/usr/bin/env bash

## ./scripts/package-version.sh <name> [version]
## Arguments:
##   name    - name of the package (e.g. @kcconfigs/example)
##   version - new version to set (e.g. 1.0.0)
##              if omitted, shows current version and prompts for input
## Description:
##   1. Update package.json#version field
##   2. Update release-please/config.json (if needed)
##   3. Create a commit with Release-As body

set -euo pipefail

cd "$(dirname "$0")/.."
export ROOT_PATH="$PWD"
export SCRIPT_PATH="$ROOT_PATH/scripts"

# shellcheck source=/dev/null
source "$SCRIPT_PATH/common/index.sh"

_main() {
  local package="$1" previous version package_path
  previous="$(pkg_get_version "$package")"
  package_path="$(pkg_path "$package")"

  if [[ -n "${2:-}" ]]; then
    version="$2"
  else
    log_info "Current version of %s: %s" "$package" "$previous"
    printf '[ASK] Enter new version: '
    read -r version
    if [[ -z "$version" ]]; then
      log_info "No version provided, aborting"
      return 1
    fi
  fi

  if [[ "$previous" == "$version" ]]; then
    log_info "Version %s is already set for package %s, skipping" "$version" "$package"
    return 0
  fi

  log_info "Step 1: Setting version %s for package %s" "$version" "$package"
  pkg_set_version "$package" "$version"

  log_info "Step 2: Refreshing release-please/config.json for package %s" "$package"
  release_please_refresh "$package"

  log_info "Step 3: Committing version bump"
  git add "$package_path" "$__RELEASEP_CONFIG"
  git commit -m "chore(${package#@}): force update v$previous => v$version

Release-As: $version"
}

exec_main \
  "${1:?name of the package is required as the first argument}" \
  "${2:-}"
