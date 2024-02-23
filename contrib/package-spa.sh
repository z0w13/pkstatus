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
cd "dist"
distName="${PKG_NAME}-${PKG_VERSION}"
mv "spa" "${distName}"
tar -zcvf "${distName}.tar.gz" "${distName}"
