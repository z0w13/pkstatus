#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

PKG_NAME="$(jq -r ".name" package.json)"
BASE_VERSION="$(jq -r ".version" package.json)"

if [[ "${NODE_ENV:=}" == "production" ]]; then
  PKG_VERSION="${BASE_VERSION}"
else
  PKG_VERSION="${BASE_VERSION}-dev+$(git rev-parse --short HEAD)"
fi

pnpm exec quasar build -m spa
distName="${PKG_NAME}-${PKG_VERSION}"

# Create zip files
cd "dist"
cp -r "spa" "${distName}"
tar -zcf "${distName}.tar.gz" "${distName}"
tar -zcf "${distName}-root.tar.gz" -C "${distName}" "."
rm -rf "${distName}"
