#!/usr/bin/env bash

set -euo pipefail

## Prepare a package for first release.
##   1. Ensure authentication to the package registry.
##   2. Create initial package in npm registry.
##   3. Wait for user to configure trusted-publishers (https://docs.npmjs.com/trusted-publishers)
##   4. Cleanup temporary files.
## Usage:
## ./scripts/prepare.sh <name>
## Arguments:
##   name                  - name of the package to prepare first release (e.g. @kcconfigs/biome)

NAME="${1:?name of the package is required as the first argument}"
TEMP_DIR="$(mktemp -d)"

check_auth() {
  echo ">> Checking... authentication to npm registry"
  if ! pnpm whoami >/dev/null 2>&1; then
    pnpm login
  fi

  echo "    Authenticated as '$(pnpm whoami)'"
}

prepare_pkg() {
  local name="$1"
  local temp="$TEMP_DIR/${name//\//-}"
  echo ">> Preparing... package '$name'"

  mkdir -p "$temp"

  echo "{
  \"name\": \"$name\",
  \"version\": \"0.0.1\",
  \"license\": \"AGPL-3.0-only\",
	\"homepage\": \"https://github.com/kc-workspace/kcws/tree/main/packages/$name\",
	\"repository\": {
		\"type\": \"git\",
		\"directory\": \"$name\",
		\"url\": \"git+https://github.com/kc-workspace/kcws.git\"
	},
	\"author\": {
		\"name\": \"Kamontat Chantrachirathumrong\",
		\"email\": \"kcws@kc.in.th\",
		\"url\": \"https://github.com/kamontat\"
	},
	\"engines\": {
		\"node\": \">=14\"
	},
	\"publishConfig\": {
		\"access\": \"public\"
	}
}" >"$temp/package.json"
}

publish_pkg() {
  local name="$1"
  local temp="$TEMP_DIR/${name//\//-}"
  echo ">> Publishing package '$name' to npm registry..."

  pnpm publish "$temp" --no-git-checks
  echo "    Temporary package '$temp' has been published to npm registry."
}

wait_configure() {
  local name="$1"
  echo ""
  echo ">> Waiting... for trusted-publishers configuration"
  echo "    Please configure trusted-publishers for the package '$name' in npm registry."
  echo "      1. https://www.npmjs.com/package/$name/access"
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

cleanup() {
  echo ">> Cleaning... temporary files/folders"
  rm -rf "$TEMP_DIR"
}

check_auth
prepare_pkg "$NAME"
publish_pkg "$NAME"
wait_configure "$NAME"
cleanup
