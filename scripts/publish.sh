#!/usr/bin/env bash

set -euo pipefail

## Usage:
## <env>=<value>... ./scripts/publish.sh
## Environment Variables:
##   GITHUB_MODE=true      - whether running in GitHub mode (additional checks and outputs)
##   TEST_MODE=true        - whether running in test mode
##   DEBUG=true            - whether to enable debug mode
##   DRYRUN=true           - whether to enable dry-run mode

## https://docs.github.com/en/actions/reference/workflows-and-actions/variables
: "${GITHUB_MODE:=${GITHUB_ACTIONS:-false}}"
: "${TEST_MODE:=${TEST:-false}}"

: "${SETTING_DRYRUN:=${DRYRUN:-$([[ $GITHUB_MODE == true ]] && printf 'false' || printf 'true')}}"
: "${SETTING_DEBUG:=${DEBUG:-$([[ ${RUNNER_DEBUG:-} == 1 ]] && printf 'true' || printf 'false')}}"

_is_github() {
  [[ "$GITHUB_MODE" == "true" ]]
}

_is_test() {
  [[ "$TEST_MODE" == "true" ]]
}

_is_dryrun() {
  [[ "$SETTING_DRYRUN" == "true" ]]
}

_is_debug() {
  [[ "$SETTING_DEBUG" == "true" ]]
}

_print() {
  local key="$1" value="$2"
  if _is_github; then
    echo "$key=$value" >>"${GITHUB_OUTPUT:?GITHUB_OUTPUT is missing on GitHub mode}"
    if _is_debug; then
      echo "[DBG] $key = '$value'" >&2
    fi
  else
    echo "$key = '$value'"
  fi
}

_print_on_test() {
  local key="$1" value="$2"
  if _is_test; then
    _print "$key" "$value"
  elif _is_debug; then
    echo "[DBG] $key = '$value'" >&2
  fi
}

_pnpm() {
  echo "$ pnpm $*"
  if ! _is_dryrun; then
    pnpm "$@"
  fi
}

verify() {
  : "${GITHUB_REF_NAME:=${REF_NAME:?REF_NAME or GITHUB_REF_NAME is required}}"
  if _is_github; then
    if [[ "${GITHUB_EVENT_NAME:?GITHUB_EVENT_NAME is missing on GitHub mode}" != "release" ]]; then
      echo "Invalid event: '$GITHUB_EVENT_NAME' (only 'release' is allowed)" >&2
      return 1
    fi
    if [[ "${GITHUB_REF_TYPE:?GITHUB_REF_TYPE is missing on GitHub mode}" != "tag" ]]; then
      echo "Invalid ref type: '$GITHUB_REF_TYPE' (only 'tag' is allowed)" >&2
      return 1
    fi
  fi

  if ! [[ "$GITHUB_REF_NAME" =~ ^@kc[a-z]+/[a-z-]+#v[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?$ ]]; then
    echo "Invalid ref name: '$GITHUB_REF_NAME' does not match expected pattern" >&2
    return 1
  fi
}

publish() {
  local args=(
    publish
    --report-summary
  )

  ## package=<package-name> (e.g. @kcconfigs/biome)
  ## scope=<scope-name> (e.g. @kcconfigs)
  ## name=<name> (e.g. biome)
  ## full_version=<full-version> (e.g. 0.1.0-beta.0)
  ## version=<version> (e.g. 0.1.0)
  ## prerelease=<prerelease-identifier> (e.g. beta or empty)
  ## prerelease_version=<prerelease-number> (e.g. .beta or empty)
  local package scope name full_version version prerelease prerelease_version
  package="${GITHUB_REF_NAME%%#*}"
  scope="${package%%/*}"
  name="${package##*/}"

  full_version="${GITHUB_REF_NAME##*#v}"
  version="${full_version%%-*}"
  prerelease="${full_version#*-}"
  if [[ "$prerelease" != "$version" ]]; then
    prerelease_version="${prerelease#*.}"
    prerelease="${prerelease%%.*}"
  else
    prerelease=""
    prerelease_version=""
  fi

  printf '[INF] Releasing "%s" version "%s"\n' "$package" "$full_version"

  _print "package" "$package"
  _print_on_test "scope" "$scope"
  _print_on_test "name" "$name"
  _print "full_version" "$full_version"
  _print_on_test "version" "$version"
  _print_on_test "prerelease" "$prerelease"
  _print_on_test "prerelease_version" "$prerelease_version"

  if test -n "$package"; then
    args+=(--filter "$package")
  else
    args+=(--recursive)
  fi

  if test -n "$prerelease"; then
    args+=(--tag "$prerelease")
  else
    args+=(--tag latest)
  fi

  if _is_github; then
    ## https://github.com/pnpm/pnpm/issues/9011
    args+=(--no-git-checks)
  fi

  args+=("$@")
  _pnpm "${args[@]}"
}

verify
publish "$@"
