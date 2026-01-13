#!/usr/bin/env bash

export __RELEASEP_CONFIG="$ROOT_PATH/.github/release-please/config.json"

release_please_refresh() {
  local package="$1" version
  version="$(pkg_get_version "$package")"

  local identifier
  read -r _ _ identifier _ <<<"$(version_parse "$version")"

  __release_please_reset "$package"
  if test -z "$identifier"; then
    __release_please_add_stable "$package"
  else
    __release_please_add_prerelease "$package" "$identifier"
  fi
}

__release_please_add_stable() {
  local package="$1"

  jq_set "$__RELEASEP_CONFIG" \
    ".packages[\"packages/$package\"].component" "$package"
}

__release_please_add_prerelease() {
  local package="$1" identifier="$2"

  __release_please_add_stable "$package"
  jq_set "$__RELEASEP_CONFIG" \
    ".packages[\"packages/$package\"].versioning" "prerelease"
  jq_set "$__RELEASEP_CONFIG" \
    ".packages[\"packages/$package\"].prerelease" "true" 'argjson'
  jq_set "$__RELEASEP_CONFIG" \
    ".packages[\"packages/$package\"][\"prerelease-type\"]" "$identifier"
}

__release_please_reset() {
  local package="$1"
  jq_set "$__RELEASEP_CONFIG" \
    ".packages[\"packages/$package\"]" "null" 'argjson'
}
