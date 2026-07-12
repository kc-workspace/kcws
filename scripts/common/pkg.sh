#!/usr/bin/env bash

export __PKG_NAME="package.json"

pkg_path() {
  local package="$1" package_path
  package_path="$(pnpm_package_path "$package")"
  printf '%s/%s' "$package_path" "$__PKG_NAME"
}
pkg_create_json() {
  local package="$1" name
  name="$(pnpm_package_name "$package")"

  printf '[ASK] Enter package name: %s\n' "$name"
  __pkg_set_json "$package" .name "$name"

  ## Cannot use initial version from release-please as it will conflict
  ## when publish next version; so we set to version before initial version
  printf '[ASK] Enter package version: 0.0.0-beta.0\n'
  pkg_set_version "$package" "0.0.0-beta.0"

  local private
  printf '[ASK] Is package private? (true/false): '
  read -r private
  __pkg_set_json "$package" .private "$private"

  local description
  printf '[ASK] Enter package description: '
  read -r description
  __pkg_set_json "$package" .description "$description"

  local homepage="https://github.com/kc-workspace/kcws/tree/main/packages/$name"
  printf '[ASK] Enter package homepage: %s\n' "$homepage"
  __pkg_set_json "$package" .homepage "$homepage"

  local directory="$name"
  printf '[ASK] Enter package repository.directory: %s\n' "$directory"
  __pkg_set_json "$package" .repository.directory "$directory"

  local keyword
  __pkg_set_json "$package" .keywords '[]' argjson
  local i=0
  while true; do
    ((i++))
    printf '[ASK] Enter package keyword %d (empty to stop): ' "$i"
    read -r keyword

    test -z "$keyword" && break
    __pkg_set_json "$package" .keywords "[\"$keyword\"]" argjson '+='
  done
}
pkg_get_version() {
  local package="$1"
  __pkg_get_json "$package" .version
}
pkg_set_version() {
  local package="$1" version="$2"
  __pkg_set_json "$package" .version "$version"
}
pkg_is_private() {
  local package="$1"
  __pkg_get_json "$package" .private
}

__pkg_get_json() {
  local package="$1" package_path
  package_path="$(pkg_path "$package")"
  shift
  jq_get "$package_path" "$@"
}
__pkg_set_json() {
  local package="$1" package_path
  package_path="$(pkg_path "$package")"
  shift
  jq_set "$package_path" "$@"
}
