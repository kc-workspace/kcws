#!/usr/bin/env bash

## version_parse 'v0.1.0-beta.0'
## version_parse '0.1.0-beta.0'
version_parse() {
  local input="$1"
  if ! [[ "$input" =~ ^[v]?[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?$ ]]; then
    log_error 2 "Invalid version string: '%s' does not match expected pattern" "$input"
    return $?
  fi

  ## full version      = full version without leading 'v'
  ## version           = major.minor.patch
  ## identifier        = prerelease identifier (e.g. beta) or empty
  ## prerelease number = prerelease number (e.g. 0) or empty
  local full_version="${input#v}" version identifier prerelease_number
  version="${full_version%%-*}"
  identifier="${full_version#*-}"
  if [[ "$version" != "$identifier" ]]; then
    prerelease_number="${identifier#*.}"
    identifier="${identifier%%.*}"
  else
    identifier=""
    prerelease_number=""
  fi

  printf '%s %s %s %s' \
    "$full_version" "$version" "$identifier" "$prerelease_number"
}

tag_is_valid() {
  [[ "$1" =~ ^@kc[a-z]+/[a-z_][a-z._-]*[+]v[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?$ ]]
}

## tag_parse '@kcconfigs/biome+v0.1.0-beta.0'
tag_parse() {
  local input="$1"
  if ! tag_is_valid "$input"; then
    log_error 2 "Invalid tag string: '%s' does not match expected pattern" "$input"
    return $?
  fi

  ## package = package name (e.g. @kcconfigs/biome)
  ## scope   = scope name (e.g. @kcconfigs)
  ## name    = name (e.g. biome)
  local package scope name

  package="${input%%+*}"
  scope="${package%%/*}"
  name="${package##*/}"

  local f v i n
  read -r f v i n <<<"$(version_parse "${input##*+v}")"

  printf '%s %s %s %s %s %s %s' \
    "$package" "$scope" "$name" "$f" "$v" "$i" "$n"
}
