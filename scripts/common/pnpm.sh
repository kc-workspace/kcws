#!/usr/bin/env bash

pnpm_package_path() {
  local package="$1"
  if pnpm_package_exist "$package"; then
    cmd_exec_silent pnpm --silent --filter "$(__pnpm_to_filter "$package")" exec pwd
  else
    printf '%s/%s' "$PACKAGE_PATH" "$package"
  fi
}

pnpm_package_name() {
  local package="$1"
  if __pnpm_is_path "$package"; then
    printf '%s' "${package//$PACKAGE_PATH\//}"
  else
    printf '%s' "$package"
  fi
}

pnpm_package_exist() {
  local package="$1"
  if __pnpm_is_path "$package"; then
    test -d "$package"
  else
    cmd_exec_silent pnpm ls -r --depth -1 | grep -q "^$package@"
  fi
}

## Delete existed node_modules and dist, then freshly install dependencies
pnpm_fresh_on() {
  local package="$1"
  pnpm_run_on "$package" exec rm -rf node_modules dist
  cmd_run pnpm install
}

pnpm_build_on() {
  local package="$1"
  pnpm_run_on "$package" build
}

pnpm_run_on() {
  local package="$1"
  shift
  cmd_run pnpm --filter "$(__pnpm_to_filter "$package")" "$@"
}
pnpm_exec_on() {
  local package="$1"
  shift
  cmd_exec pnpm --filter "$(__pnpm_to_filter "$package")" "$@"
}

__pnpm_is_path() {
  [[ $package =~ ^/ ]]
}
__pnpm_to_filter() {
  local package="$1"
  if __pnpm_is_path "$package"; then
    package="${package//$ROOT_PATH/.}"
  fi
  printf '%s' "$package"
}
