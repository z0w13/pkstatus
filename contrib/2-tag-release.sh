#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

. contrib/shared.sh

main() {
  autosetNodeEnv

  local version
  version="$(getVersion)"

  git add "CHANGELOG.md" "package.json"
  git commit -m "chore(release): release v${version}"
  git tag -a -m "release v${version}" "v${version}"

  git push origin main --follow-tags
}

main "$@"
