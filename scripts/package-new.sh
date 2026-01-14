#!/usr/bin/env bash

## ./scripts/package-new.sh <name>
## Arguments:
##   name - name of the new package (e.g. @kcconfigs/example)
## Description:
##   1. Create package from `@kcinternals/starter`
##   2. Update package.json file
##   3. Build package
##   4. Add package to release-please/config.json
##   5. Initializing package in npm registry

set -euo pipefail

cd "$(dirname "$0")/.."
export ROOT_PATH="$PWD"
export SCRIPT_PATH="$ROOT_PATH/scripts"

# shellcheck source=/dev/null
source "$SCRIPT_PATH/common/index.sh"

_main() {
  local package="$1" package_path
  package_path="$(pnpm_package_path "$package")"

  if ! pnpm_package_exist "$package_path"; then
    local starter="@kcinternals/starter" starter_path
    starter_path="$(pnpm_package_path "$starter")"

    log_info "Step 1: Copying starter package to %s" "$package"
    cmd_run cp -r "$starter_path" "$package_path"

    log_info "Step 2: Updating $package_path/package.json"
    pkg_create_json "$package_path"
  else
    log_info "Step 1: SKIPPING copy for existing package %s" "$package"
    log_info "Step 2: SKIPPING update %s/package.json" "$package_path"
  fi

  log_info "Step 3: Building package %s" "$package"
  pnpm_fresh_on "$package"
  pnpm_build_on "$package"

  log_info "Step 4: Adding package to release-please/config.json"
  release_please_refresh "$package"

  log_info "Step 5: Initializing package in npm registry"
  registry_setup "$package_path"
}

exec_main "${1:?name of the package is required as the first argument}"
