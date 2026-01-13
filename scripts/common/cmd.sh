#!/usr/bin/env bash

## Similar to cmd_exec, but support DRYRUN variable
cmd_run() {
  if "${DRYRUN:-false}"; then
    __log DRY "$ $*"
  else
    cmd_exec "$@"
  fi
}

## Similar to cmd_exec_silent, but support DRYRUN variable
cmd_run_silent() {
  if "${DRYRUN:-false}"; then
    __log DRY "$ $*"
  else
    cmd_exec_silent "$@"
  fi
}

## Execute command if exists
cmd_exec() {
  local cmd="$1"
  shift

  if command -v "$cmd" >/dev/null 2>&1; then
    __log CMD "$ $cmd $*"
    "$cmd" "$@"
  else
    log_error 1 "Error: command '$cmd' not found."
    return $?
  fi
}

cmd_exec_silent() {
  local cmd="$1"
  shift

  if command -v "$cmd" >/dev/null 2>&1; then
    "$cmd" "$@"
  else
    log_error 1 "Error: command '$cmd' not found."
    return $?
  fi
}
