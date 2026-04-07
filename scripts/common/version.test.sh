#!/usr/bin/env bash

## mock log_error for testing
log_error() {
  return "$1"
}

_check_version_parse() {
  local input="$1" code tmp
  tmp="$(mktemp)"

  version_parse "$input" >"$tmp" 2>&1
  code=$?

  read -r full version identifier number <<<"$(cat "$tmp")"
  rm -f "$tmp"

  local expected_code="$2"
  local expected_full="$3"
  local expected_version="$4"
  local expected_identifier="$5"
  local expected_number="$6"

  if [[ $code -ne $expected_code ]]; then
    test_fail "code: expected '$expected_code', got '$code'"
  elif [[ "$full" != "$expected_full" ]]; then
    test_fail "full: expected '$expected_full', got '$full'"
  elif [[ "$version" != "$expected_version" ]]; then
    test_fail "version: expected '$expected_version', got '$version'"
  elif [[ "$identifier" != "$expected_identifier" ]]; then
    test_fail "identifier: expected '$expected_identifier', got '$identifier'"
  elif [[ "$number" != "$expected_number" ]]; then
    test_fail "number: expected '$expected_number', got '$number'"
  else
    test_pass "version_parse('$input')"
  fi
}

_check_tag_parse() {
  local input="$1" code tmp
  tmp="$(mktemp)"

  tag_parse "$input" >"$tmp" 2>&1
  code=$?

  read -r package scope name full version identifier number <<<"$(cat "$tmp")"
  rm -f "$tmp"

  local expected_code="$2"
  local expected_package="$3"
  local expected_scope="$4"
  local expected_name="$5"
  local expected_full="$6"
  local expected_version="$7"
  local expected_identifier="$8"
  local expected_number="$9"

  if [[ $code -ne $expected_code ]]; then
    test_fail "code: expected '$expected_code', got '$code'"
  elif [[ "$package" != "$expected_package" ]]; then
    test_fail "package: expected '$expected_package', got '$package'"
  elif [[ "$scope" != "$expected_scope" ]]; then
    test_fail "scope: expected '$expected_scope', got '$scope'"
  elif [[ "$name" != "$expected_name" ]]; then
    test_fail "name: expected '$expected_name', got '$name'"
  elif [[ "$full" != "$expected_full" ]]; then
    test_fail "full: expected '$expected_full', got '$full'"
  elif [[ "$version" != "$expected_version" ]]; then
    test_fail "version: expected '$expected_version', got '$version'"
  elif [[ "$identifier" != "$expected_identifier" ]]; then
    test_fail "identifier: expected '$expected_identifier', got '$identifier'"
  elif [[ "$number" != "$expected_number" ]]; then
    test_fail "number: expected '$expected_number', got '$number'"
  else
    test_pass "version_parse('$input')"
  fi
}

_test_runner() {
  _check_version_parse "" 2
  _check_version_parse "invalid-version" 2
  _check_version_parse "1" 2
  _check_version_parse "1.0" 2
  _check_version_parse "1.0.0.beta" 2
  _check_version_parse "1.0.0-beta" 2
  _check_version_parse "1.0.0-123.num" 2
  _check_version_parse "1.0.0-123.123" 2
  _check_version_parse "1.0.0-alpha.num" 2
  _check_version_parse "1.0.0-alpha.n123" 2
  _check_version_parse "1.0.0-" 2
  _check_version_parse "vv1.2.3" 2

  ## with prefix 'v'
  _check_version_parse "v1.0.0" 0 "1.0.0" "1.0.0" "" ""
  ## without prefix
  _check_version_parse "1.2.3" 0 "1.2.3" "1.2.3" "" ""
  ## with prerelease identifier
  _check_version_parse "0.0.1-alpha.0" 0 "0.0.1-alpha.0" "0.0.1" "alpha" "0"
  ## with 2 digit prerelease number
  _check_version_parse "0.0.1-alpha.20" 0 "0.0.1-alpha.20" "0.0.1" "alpha" "20"

  _check_tag_parse "" 2
  _check_tag_parse "v0.1.0" 2                              ## missing package
  _check_tag_parse "kcexamples/package1+v0.1.0" 2          ## invalid scope (missing @)
  _check_tag_parse "@kcconfigs/tsdown@v0.1.0" 2            ## invalid separator (@ instead of +)
  _check_tag_parse "@kcconfigs/tsdown+0.1.0" 2             ## missing 'v' prefix
  _check_tag_parse "@kcconfigs/tsdown+v0.1.0-beta-1" 2     ## invalid prerelease separator (hyphen instead of dot)
  _check_tag_parse "@kctools/pkg+v0.1" 2                   ## incomplete version (missing patch)
  _check_tag_parse "@kctools/pkg+v1.0.0.0" 2               ## too many version parts
  _check_tag_parse "@kcinternals/pkg+v1.0" 2               ## missing patch version
  _check_tag_parse "@kcinternals/pkg+Va.b.c" 2             ## uppercase V prefix
  _check_tag_parse "@kcexamples/Tsdown+v0.1.0" 2           ## uppercase package name
  _check_tag_parse "@kctypes/pkg+v0.1.0-BETA.0" 2          ## uppercase prerelease type
  _check_tag_parse "@kcws/pkg+v0.1.0-" 2                   ## prerelease hyphen without identifier
  _check_tag_parse "@kctools/pkg2+v0.1.0-beta" 2           ## prerelease without version number
  _check_tag_parse "@kcconfigs/pkg+v0.1.0-1.0" 2           ## prerelease starting with number
  _check_tag_parse "@other/tsdown+v0.1.0" 2                ## invalid scope (not @kc prefix)
  _check_tag_parse "@kcconfigs/+v0.1.0" 2                  ## missing package name
  _check_tag_parse "@kcexamples/pkg2+v0.1.0-beta.0-rc.1" 2 ## multiple prerelease segments
  _check_tag_parse "@kcexamples/pkg2#v0.1.0-beta.0-rc.1" 2 ## multiple prerelease segments

  ## Test case: Beta prerelease version
  _check_tag_parse "@kcconfigs/biome+v0.1.0-beta.0" 0 \
    "@kcconfigs/biome" "@kcconfigs" "biome" \
    "0.1.0-beta.0" "0.1.0" "beta" "0"

  ## Test case: Stable release (no prerelease)
  _check_tag_parse "@kcconfigs/tsdown+v1.0.0" 0 \
    "@kcconfigs/tsdown" "@kcconfigs" "tsdown" \
    "1.0.0" "1.0.0" "" ""

  ## Test case: Alpha prerelease version
  _check_tag_parse "@kcconfigs/tsdown+v1.2.3-alpha.0" 0 \
    "@kcconfigs/tsdown" "@kcconfigs" "tsdown" \
    "1.2.3-alpha.0" "1.2.3" "alpha" "0"

  ## Test case: Release candidate (RC) with different scope
  _check_tag_parse "@kctools/package+v0.0.1-rc.1" 0 \
    "@kctools/package" "@kctools" "package" \
    "0.0.1-rc.1" "0.0.1" "rc" "1"

  ## Test case: Higher version numbers with different scope
  _check_tag_parse "@kcinternals/core+v2.5.0" 0 \
    "@kcinternals/core" "@kcinternals" "core" \
    "2.5.0" "2.5.0" "" ""

  ## Test case: Double-digit prerelease version number
  _check_tag_parse "@kcconfigs/biome+v0.1.0-beta.10" 0 \
    "@kcconfigs/biome" "@kcconfigs" "biome" \
    "0.1.0-beta.10" "0.1.0" "beta" "10"

  ## Test case: @kcexamples scope
  _check_tag_parse "@kcexamples/sample+v2.0.0" 0 \
    "@kcexamples/sample" "@kcexamples" "sample" \
    "2.0.0" "2.0.0" "" ""

  ## Test case: @kctypes scope with prerelease
  _check_tag_parse "@kctypes/definitions+v1.5.0-alpha.2" 0 \
    "@kctypes/definitions" "@kctypes" "definitions" \
    "1.5.0-alpha.2" "1.5.0" "alpha" "2"

  ## Test case: @kcws scope
  _check_tag_parse "@kcws/workspace+v0.5.0-rc.0" 0 \
    "@kcws/workspace" "@kcws" "workspace" \
    "0.5.0-rc.0" "0.5.0" "rc" "0"

  ## Test case: when package name contains .
  _check_tag_parse "@kcstyles/reset.css+v1.0.0" 0 \
    "@kcstyles/reset.css" "@kcstyles" "reset.css" \
    "1.0.0" "1.0.0" "" ""

  ## Test case: when package name contains _
  _check_tag_parse "@kctypes/package_json+v0.2.3" 0 \
    "@kctypes/package_json" "@kctypes" "package_json" \
    "0.2.3" "0.2.3" "" ""
}

test_run "$@"
