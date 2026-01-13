#!/usr/bin/env bash

## log_debug "This is a debug message"
log_debug() {
  if ${DEBUG:-false}; then
    __log DBG "$@"
  fi
}
## log_info "This is an info"
log_info() {
  __log INF "$@"
}
## log_warn "This is a warning"
log_warn() {
  __log WRN "$@"
}
## log_error 1 "Exit with code 1"
log_error() {
  local exit_code="$1"
  shift

  __log ERR "$@"
  exit "$exit_code"
}

## __log <LEVEL> <FORMAT> [ARGS...]
__log() {
  local level="$1" format="$2"
  shift 2

  printf "[%3s] $format\n" "$level" "$@" >&2
}
