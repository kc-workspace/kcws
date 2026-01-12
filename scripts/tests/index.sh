#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../.."

export TEST_MODE=true

export ROOT_PATH="$PWD"
export SCRIPT_PATH="$ROOT_PATH/scripts"
export COMMON_PATH="$SCRIPT_PATH/common"

test_run() {
  local src="$1"
  local callback="_test_runner"
  if command -v "$callback" >/dev/null 2>&1; then
    # shellcheck source=/dev/null
    source "$src"

    "$callback"
  else
    echo "Callback function '$callback' failed." >&2
    exit 1
  fi
}
export -f test_run

test_start() {
  printf '=== Checking... "%s" ===\n' "$1"
}
export -f test_start

test_pass() {
  printf -- '  - \033[32mPASSED\033[0m - %s\n' "$1"
}
export -f test_pass

test_fail() {
  printf -- '  - \033[31mFAILED\033[0m - %s\n' "$1"
}
export -f test_fail

test_main() {
  local script_test script_src
  for script_test in "$COMMON_PATH"/*.test.sh; do
    if test -f "$script_test"; then
      script_src="${script_test%.test.sh}.sh"
      test_start "$(basename "$script_src")"

      bash "$script_test" "$script_src"
    fi
  done
}

test_main
