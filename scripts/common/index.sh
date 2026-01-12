#!/usr/bin/env bash

export PACKAGE_PATH="${ROOT_PATH:?missing required variable: ROOT_PATH}/packages"
export COMMON_PATH="${SCRIPT_PATH:?missing required variable: SCRIPT_PATH}/common"

# shellcheck source=/dev/null
source "$COMMON_PATH/logger.sh"
# shellcheck source=/dev/null
source "$COMMON_PATH/version.sh"
# shellcheck source=/dev/null
source "$COMMON_PATH/cmd.sh" ## depends on logger.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/jq.sh" ## depends on cmd.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/main.sh" ## depends on cmd.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/pnpm.sh" ## depends on cmd.sh and logger.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/pkg.sh" ## depends on pnpm.sh and jq.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/releasep.sh" ## depends on pkg.sh and jq.sh
# shellcheck source=/dev/null
source "$COMMON_PATH/registry.sh" ## depends on pnpm.sh and logger.sh
