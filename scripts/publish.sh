#!/usr/bin/env bash

# REF_TYPE: tag
export REF_TYPE="${REF_TYPE:?REF_TYPE is required}"
# REF_NAME: @kcconfigs/biome#v0.1.0-beta.0
export REF_NAME="${REF_NAME:?REF_NAME is required}"

# EVENT_NAME: release
export EVENT_NAME="${EVENT_NAME:?EVENT_NAME is required}"
# EVENT_PATH: /home/runner/work/_temp/_github_workflow/event.json
export EVENT_PATH="${EVENT_PATH:?EVENT_PATH is required}"

: "${DRYRUN:=false}"

_print() {
  local key="$1" value="$2"

  if test -f "$GITHUB_OUTPUT" && test -z "$TEST_MODE"; then
    echo "$key=$value" >>"$GITHUB_OUTPUT"
  else
    echo "$key = '$value'"
  fi
}

verify() {
  if [[ "$REF_TYPE" != "tag" ]]; then
    echo "Skipping publish: REF_TYPE is not 'tag' (got '$REF_TYPE')"
    exit 0
  fi
  if [[ "$EVENT_NAME" != "release" ]]; then
    echo "Skipping publish: EVENT_NAME is not 'release' (got '$EVENT_NAME')"
    exit 0
  fi
  if ! [[ "$REF_NAME" =~ ^@kc[a-z]+/[a-z-]+#v[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?$ ]]; then
    echo "Invalid REF_NAME: '$REF_NAME' does not match expected pattern"
    exit 1
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
  package="${REF_NAME%%#*}"
  scope="${package%%/*}"
  name="${package##*/}"

  full_version="${REF_NAME##*#v}"
  version="${full_version%%-*}"
  prerelease="${full_version#*-}"
  if [[ "$prerelease" != "$version" ]]; then
    prerelease_version="${prerelease#*.}"
    prerelease="${prerelease%%.*}"
  else
    prerelease=""
    prerelease_version=""
  fi

  _print "package" "$package"
  _print "scope" "$scope"
  _print "name" "$name"
  _print "full_version" "$full_version"
  _print "version" "$version"
  _print "prerelease" "$prerelease"
  _print "prerelease_version" "$prerelease_version"

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

  args+=("$@")
  _pnpm "${args[@]}"
}

_pnpm() {
  echo "$ pnpm $*"
  if [[ "$DRYRUN" != "true" ]]; then
    pnpm "$@"
  fi
}

verify
publish "$@"
