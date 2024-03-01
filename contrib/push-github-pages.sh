#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

. contrib/shared.sh

onExit() {
  resetVersion
}

main() {
  setVersion "$(generateVersion)"

  PKSTATUS_BUILD_MODE="gh-pages" pnpm exec quasar build -m pwa

  pushd dist/pwa
  git init -b gh-pages
  git remote add origin git@github.com:z0w13/pkstatus.git
  git add .
  git commit -m "Initial commit"
  git push origin gh-pages -f
  popd
}

trap onExit EXIT
main "$@"
