set -euo pipefail

GITHUB_REPO="https://github.com/z0w13/pkstatus"
REPO_ROOT="$(git rev-parse --show-toplevel)"

setVersion() {
  local newVersion="$1"

  pushd "$REPO_ROOT" &> /dev/null
  pkgJson="$(cat package.json)"
  echo "$pkgJson" | jq ".version |= \"${newVersion}\"" > package.json
  popd &> /dev/null
}

resetVersion() {
  pushd "$REPO_ROOT" &> /dev/null
  git checkout package.json
  popd &> /dev/null
}

getVersion() {
  pushd "$REPO_ROOT" &> /dev/null
  jq -r .version package.json
  popd &> /dev/null
}

generateVersion() {
  # Override version for packaging
  if [[ "${NODE_ENV:=}" != "production" ]]; then
    echo "$(getVersion)-dev+$(git rev-parse --short HEAD)"
  else
    getVersion
  fi
}

autosetNodeEnv() {
  if [[ -n "$NODE_ENV" ]]; then
    return
  fi

  if revisionHasTag HEAD; then
    export NODE_ENV=production
  else
    export NODE_ENV=development
  fi
}

revisionHasTag() {
  local rev="${1:-HEAD}"
  test -n "$(git tag --points-at "$rev")"
}
