#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

. contrib/shared.sh

main() {
  local version
  version="$(getVersion)"

  git add "CHANGELOG.md" "package.json"
  git commit -m "chore(release): release v${version}"
  git tag "v${version}"

  git push origin main --follow-tags
}

main "$@"
