#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

. contrib/shared.sh

generateChangelog() {
  local currentVersion="$1"
  local newVersion="$2"

  local changelogPre
  changelogPre="$(head -n2 CHANGELOG.md)"

  local changelogPost
  changelogPost="$(tail -n+3 CHANGELOG.md)"

  {
    echo "$changelogPre"
    echo -e "\n## [${newVersion}](${GITHUB_REPO}/compare/v${currentVersion}...v${newVersion}) (${currentDate})"
    echo -e "\n\n### Features\n\nTODO"
    echo -e "\n\n### Bug Fixes\n\nTODO\n"
    echo "$changelogPost"
  } > CHANGELOG.md
}

main() {
  if [[ "$#" -lt 1 ]]; then
    echo "Usage: $0 <new-version>"
    exit 1
  fi

  local currentDate
  currentDate="$(date +'%Y-%m-%d')"

  local currentVersion
  currentVersion="$(getVersion)"

  local newVersion="$1"

  setVersion "$newVersion"
  generateChangelog "$currentVersion" "$newVersion"
}

main "$@"
