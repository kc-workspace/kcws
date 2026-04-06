#!/usr/bin/env bash

## ./scripts/package-publish.sh [name]
## Arguments:
##   name - name of the package build and publish (e.g. @kcconfigs/example)
## Description:
##   1. If name is provided, use it to publish specific package
##   2. If run on GitHub Actions, use REF_NAME to determine package and version
##   3. If none provide, publish all packages to npm registry
## Examples:
##   ./scripts/package-publish.sh @kcconfigs/biome
##   GITHUB_REF_NAME=@kcexamples/test+v1.0.0 ./scripts/package-publish.sh
##   ./scripts/package-publish.sh

set -euo pipefail

cd "$(dirname "$0")/.."
export ROOT_PATH="$PWD"
export SCRIPT_PATH="$ROOT_PATH/scripts"

# shellcheck source=/dev/null
source "$SCRIPT_PATH/common/index.sh"

__is_github() {
  ## https://docs.github.com/en/actions/reference/workflows-and-actions/variables
  [[ "${GITHUB_ACTIONS:-false}" == "true" ]]
}
__verify_release_mode() {
  if [[ "$GITHUB_EVENT_NAME" != "release" ]]; then
    log_error 1 "Invalid event: '$GITHUB_EVENT_NAME' (only 'release' is allowed)"
    return $?
  fi
  if [[ "$GITHUB_REF_TYPE" != "tag" ]]; then
    log_error 1 "Invalid ref type: '$GITHUB_REF_TYPE' (only 'tag' is allowed)"
    return $?
  fi
  if ! tag_is_valid "$GITHUB_REF_NAME"; then
    log_error 1 "Invalid tag string: '%s' does not match expected pattern" "$GITHUB_REF_NAME"
    return $?
  fi
}

_main() {
  local package="$1" version identifier

  if test -n "$package"; then
    version="$(pkg_get_version "$package")"
    read -r _ _ identifier _ <<<"$(version_parse "$version")"
  elif __is_github; then
    __verify_release_mode
    read -r package _ _ version _ identifier _ <<<"$(tag_parse "$GITHUB_REF_NAME")"
    local expected_version
    expected_version="$(pkg_get_version "$package")"
    if [[ "$version" != "$expected_version" ]]; then
      log_error 1 "Version mismatch for package '%s': expected '%s', got '%s'" \
        "$package" "$expected_version" "$version"
      return $?
    fi

    {
      echo "package=$package"
      echo "version=$version"
      echo "identifier=$identifier"
    } >>"$GITHUB_OUTPUT"
  fi

  local publish_args=(
    publish
    --report-summary
  )
  local build_args=(
    run --if-present --stream
  )

  if test -n "$package"; then
    publish_args+=(--filter "$package")
    build_args+=(--filter "$package")
  else
    publish_args+=(--recursive)
    build_args+=(--recursive)
  fi

  if test -n "$identifier"; then
    publish_args+=(--tag "$identifier")
  else
    publish_args+=(--tag latest)
  fi

  if __is_github; then
    ## https://github.com/pnpm/pnpm/issues/9011
    publish_args+=(--no-git-checks)
  fi
  build_args+=(build)

  cmd_run pnpm "${build_args[@]}"
  cmd_run pnpm "${publish_args[@]}"
}

exec_main "${1:-}"
