#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

PKG_NAME="$(jq -r ".name" package.json)"
PRODUCT_NAME="$(jq -r ".productName" package.json)"
BASE_VERSION="$(jq -r ".version" package.json)"

if [[ "${NODE_ENV:=}" == "production" ]]; then
  PKG_VERSION="${BASE_VERSION}"
else
  PKG_VERSION="${BASE_VERSION}-dev+$(git rev-parse --short HEAD)"
fi

# Override version for packaging
PKG_JSON="$(cat package.json)"
echo "$PKG_JSON"| jq ".version |= \"${PKG_VERSION}\"" > package.json

function packageSpa() {
  distName="${PKG_NAME}-${PKG_VERSION}"

  pnpm exec quasar build -m spa

  # Create zip files
  pushd "dist"
  cp -r "spa" "${distName}"
  tar -zcf "artifact/spa-${distName}.tar.gz" "${distName}"
  tar -zcf "artifact/spa-${distName}-root.tar.gz" -C "${distName}" "."
  rm -rf "${distName}"
  popd
}

function packageElectron() {
  # Windows
  pnpm exec quasar build -m electron -T win
  cp \
    "dist/electron/Packaged/${PRODUCT_NAME} Setup ${PKG_VERSION%%+*}.exe" \
    "dist/artifact/${PRODUCT_NAME} Setup ${PKG_VERSION}.exe"

  pushd "dist/electron/Packaged"
  cp -rv "win-unpacked" "${PRODUCT_NAME} ${PKG_VERSION}"
  zip -r "../../artifact/${PRODUCT_NAME} ${PKG_VERSION}.zip" "${PRODUCT_NAME} ${PKG_VERSION}"
  rm -rf "${PRODUCT_NAME} ${PKG_VERSION}"
  popd

  # Linux
  pnpm exec quasar build -m electron -T linux
  cp \
    "dist/electron/Packaged/${PRODUCT_NAME}-${PKG_VERSION%%+*}.AppImage" \
    "dist/artifact/${PRODUCT_NAME}-${PKG_VERSION}.AppImage"
  cp \
    "dist/electron/Packaged/${PKG_NAME}_${PKG_VERSION%%+*}_amd64.snap" \
    "dist/artifact/${PKG_NAME}_${PKG_VERSION}_amd64.snap"

  pushd "dist/electron/Packaged"
  cp -rv "linux-unpacked" "${PRODUCT_NAME}_${PKG_VERSION}"
  tar -zcf "../../artifact/${PRODUCT_NAME}_${PKG_VERSION}.tar.gz" "${PRODUCT_NAME}_${PKG_VERSION}"
  rm -rf "${PRODUCT_NAME}_${PKG_VERSION}"
  popd
}

function pushGhPages() {
  PKSTATUS_BUILD_MODE="gh-pages" pnpm exec quasar build -m spa
  pushd dist/spa
  git init -b gh-pages
  git remote add origin git@github.com:z0w13/pkstatus.git
  git add .
  git commit -m "Initial commit"
  git push origin gh-pages -f
  popd
}

createRelease() {
  releaseFlags=""
  if [[ "${NODE_ENV:=}" != "production" ]]; then
    releaseFlags="${releaseFlags} --prerelease"
  fi

  gh release create "$PKG_VERSION" "./dist/artifact/*"
}

main() {
  rm -rf "dist/artifact"
  mkdir -p "dist/artifact"

  case "${1:-}" in
    "spa")
      packageSpa
      ;;
    "electron")
      packageElectron
      ;;
    "pages")
      pushGhPages
      ;;
    "release")
      createRelease
      ;;
    *)
      packageSpa
      packageElectron
      pushGhPages
      createRelease
      ;;
  esac

  echo "$PKG_JSON" > package.json
}

main "$@"
