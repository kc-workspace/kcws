#!/usr/bin/env bash

registry_setup() {
  local package="$1"

  __registry_check_auth

  __registry_publish "$package"
  __registry_waiting "$package"
}

__registry_check_auth() {
  log_info "  > Checking... authentication to npm registry"
  if ! pnpm whoami >/dev/null 2>&1; then
    pnpm login
  fi
  log_info "    Authenticated as '$(pnpm whoami)'"
}

__registry_publish() {
  local package="$1"

  log_info "  > Publishing... empty package to npm registry"
  pnpm_run_on "$package" publish --no-git-checks --tag beta --report-summary
}

__registry_waiting() {
  local package="$1"
  echo
  echo ">> Waiting... for trusted-publishers configuration"
  echo "    Please configure trusted-publishers for the package '$package' in npm registry."
  echo "      1. https://www.npmjs.com/package/$package/access"
  echo "      2. Select 'GitHub Actions' as trusted publisher"
  echo "      3. Enter 'kc-workspace/kcws' as repository"
  echo "      4. Enter 'publish.yaml' as workflow file"
  echo "      5. Enter 'production' as environment"
  echo "      6. Click 'Set up connection' button"
  echo "      7. On 'Publishing access' section"
  echo "        - Select 'Require two-factor authentication and disallow tokens (recommended)'"
  echo "    Visit: https://docs.npmjs.com/trusted-publishers"

  printf "    Press ENTER to continue after configuration..."
  read -r _
}
