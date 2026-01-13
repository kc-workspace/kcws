#!/usr/bin/env bash

jq_get() {
  local json_path="$1" json_name="$2"
  __jq_exec_silent -r "$json_name" "$json_path"
}

jq_set() {
  local json_path="$1" json_name="$2" json_value="$3"
  local json_value_key="${4:-arg}" json_assign="${5:-=}"

  local name
  name="$(basename "$json_path")"

  local tmp
  tmp="$(mktemp)"

  local previous
  previous="$(jq_get "$json_path" "$json_name")"

  log_info "Updating... '%-20s' %s: %s -> %s" \
    "$json_name" "$name" "$previous" "$json_value"

  local args=(
    "--$json_value_key" value "$json_value"
    "$json_name $json_assign \$value"
    "$json_path"
  )

  __jq_run "${args[@]}" >"$tmp"
  cmd_run_silent mv "$tmp" "$json_path"
}

__jq_run() {
  cmd_run jq "$@"
}
__jq_exec() {
  cmd_exec jq "$@"
}
__jq_exec_silent() {
  cmd_exec_silent jq "$@"
}
