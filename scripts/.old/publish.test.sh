#!/usr/bin/env bash

export TEST_MODE=true

show_start() {
  local name="$1"
  printf '=== Checking... "%s" ===\n' "$name"
}

show_pass() {
  printf -- '  - \033[32mPASSED\033[0m (%s)\n' "$2"
}

show_fail() {
  printf -- '  - \033[31mFAILED\033[0m (%s)\n' "$2"
}

run_test() {
  local code="$1" temp is_passed=false is_failed=false
  export REF_NAME="$2"
  temp="$(mktemp)"

  show_start "$REF_NAME"

  "$(dirname "$0")/publish.sh" >"$temp" 2>&1
  local actual_code="$?"

  if [[ $code -ne $actual_code ]]; then
    show_fail "$temp" "expected exit code $code, got $actual_code"
    is_failed=true
  fi
  if [[ $code -gt 0 ]]; then
    show_pass "$temp" "only check exit code"
    is_passed=true
  fi

  if ! "$is_passed"; then
    local expected_package="$3"
    local expected_scope="$4"
    local expected_name="$5"
    local expected_full_version="$6"
    local expected_version="$7"
    local expected_prerelease="$8"
    local expected_prerelease_version="$9"

    if ! grep -q "package = '$expected_package'" "$temp"; then
      show_fail "$temp" "package does not match expected value"
      is_failed=true
    fi
    if ! grep -q "scope = '$expected_scope'" "$temp"; then
      show_fail "$temp" "scope does not match expected value"
      is_failed=true
    fi
    if ! grep -q "name = '$expected_name'" "$temp"; then
      show_fail "$temp" "name does not match expected value"
      is_failed=true
    fi
    if ! grep -q "full_version = '$expected_full_version'" "$temp"; then
      show_fail "$temp" "full_version does not match expected value"
      is_failed=true
    fi
    if ! grep -q "version = '$expected_version'" "$temp"; then
      show_fail "$temp" "version does not match expected value"
      is_failed=true
    fi
    if ! grep -q "prerelease = '$expected_prerelease'" "$temp"; then
      show_fail "$temp" "prerelease does not match expected value"
      is_failed=true
    fi
    if ! grep -q "prerelease_version = '$expected_prerelease_version'" "$temp"; then
      show_fail "$temp" "prerelease_version does not match expected value"
      is_failed=true
    fi
  fi

  if ! "$is_failed" && ! "$is_passed"; then
    show_pass "$temp" "all values match expected"
    is_passed=true
  fi

  if "$is_failed"; then
    echo '```'
    cat "$temp"
    echo '```'
  fi
  rm "$temp"
}

assert_pass() {
  run_test 0 "$@"
}

assert_fail() {
  run_test 1 "$@"
}

assert_fail "v0.1.0"                              ## missing package
assert_fail "kcexamples/package1+v0.1.0"          ## invalid scope (missing @)
assert_fail "@kcconfigs/tsdown@v0.1.0"            ## invalid separator (@ instead of +)
assert_fail "@kcconfigs/tsdown+0.1.0"             ## missing 'v' prefix
assert_fail "@kcconfigs/tsdown+v0.1.0-beta-1"     ## invalid prerelease separator (hyphen instead of dot)
assert_fail "@kctools/pkg+v0.1"                   ## incomplete version (missing patch)
assert_fail "@kctools/pkg+v1.0.0.0"               ## too many version parts
assert_fail "@kcinternals/pkg+v1.0"               ## missing patch version
assert_fail "@kcinternals/pkg+Va.b.c"             ## uppercase V prefix
assert_fail "@kcexamples/Tsdown+v0.1.0"           ## uppercase package name
assert_fail "@kctypes/pkg+v0.1.0-BETA.0"          ## uppercase prerelease type
assert_fail "@kcws/pkg+v0.1.0-"                   ## prerelease hyphen without identifier
assert_fail "@kctools/pkg2+v0.1.0-beta"           ## prerelease without version number
assert_fail "@kcconfigs/pkg+v0.1.0-1.0"           ## prerelease starting with number
assert_fail "@other/tsdown+v0.1.0"                ## invalid scope (not @kc prefix)
assert_fail "@kcconfigs/+v0.1.0"                  ## missing package name
assert_fail "@kcexamples/pkg2+v0.1.0-beta.0-rc.1" ## multiple prerelease segments
assert_fail "@kcexamples/pkg2#v0.1.0-beta.0-rc.1" ## multiple prerelease segments

## Test case: Beta prerelease version
assert_pass "@kcconfigs/biome+v0.1.0-beta.0" \
  "@kcconfigs/biome" \
  "@kcconfigs" \
  "biome" \
  "0.1.0-beta.0" \
  "0.1.0" \
  "beta" \
  "0"

## Test case: Stable release (no prerelease)
assert_pass "@kcconfigs/tsdown+v1.0.0" \
  "@kcconfigs/tsdown" \
  "@kcconfigs" \
  "tsdown" \
  "1.0.0" \
  "1.0.0" \
  "" \
  ""

## Test case: Alpha prerelease version
assert_pass "@kcconfigs/tsdown+v1.2.3-alpha.0" \
  "@kcconfigs/tsdown" \
  "@kcconfigs" \
  "tsdown" \
  "1.2.3-alpha.0" \
  "1.2.3" \
  "alpha" \
  "0"

## Test case: Release candidate (RC) with different scope
assert_pass "@kctools/package+v0.0.1-rc.1" \
  "@kctools/package" \
  "@kctools" \
  "package" \
  "0.0.1-rc.1" \
  "0.0.1" \
  "rc" \
  "1"

## Test case: Higher version numbers with different scope
assert_pass "@kcinternals/core+v2.5.0" \
  "@kcinternals/core" \
  "@kcinternals" \
  "core" \
  "2.5.0" \
  "2.5.0" \
  "" \
  ""

## Test case: Double-digit prerelease version number
assert_pass "@kcconfigs/biome+v0.1.0-beta.10" \
  "@kcconfigs/biome" \
  "@kcconfigs" \
  "biome" \
  "0.1.0-beta.10" \
  "0.1.0" \
  "beta" \
  "10"

## Test case: @kcexamples scope
assert_pass "@kcexamples/sample+v2.0.0" \
  "@kcexamples/sample" \
  "@kcexamples" \
  "sample" \
  "2.0.0" \
  "2.0.0" \
  "" \
  ""

## Test case: @kctypes scope with prerelease
assert_pass "@kctypes/definitions+v1.5.0-alpha.2" \
  "@kctypes/definitions" \
  "@kctypes" \
  "definitions" \
  "1.5.0-alpha.2" \
  "1.5.0" \
  "alpha" \
  "2"

## Test case: @kcws scope
assert_pass "@kcws/workspace+v0.5.0-rc.0" \
  "@kcws/workspace" \
  "@kcws" \
  "workspace" \
  "0.5.0-rc.0" \
  "0.5.0" \
  "rc" \
  "0"
