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

  local version
  printf '[ASK] Enter package version (default 0.1.0-beta.0): '
  read -r version
  pkg_set_version "$package" "${version:-0.1.0-beta.0}"

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
