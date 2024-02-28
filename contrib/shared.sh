GITHUB_REPO="https://github.com/z0w13/pkstatus"
REPO_ROOT="$(git rev-parse --show-toplevel)"

setVersion() {
  local newVersion="$1"

  pkgJson="$(cat package.json)"
  echo "$pkgJson" | jq ".version |= \"${newVersion}\"" > package.json
}

getVersion() {
  jq -r .version package.json
}
