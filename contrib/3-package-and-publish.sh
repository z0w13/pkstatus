#!/usr/bin/env bash
set -euo pipefail
test -n "${DEBUG:-}" && set -x

. contrib/shared.sh

packageSinglePageApp() {
  local pkgName="$1"
  local pkgVersion="$2"

  distName="${pkgName}-${pkgVersion}"

  pnpm exec quasar build -m spa

  # Create zip files
  pushd "dist"
  cp -r "spa" "${distName}"
  tar -zcf "artifact/spa-${distName}.tar.gz" "${distName}"
  tar -zcf "artifact/spa-${distName}-root.tar.gz" -C "${distName}" "."
  rm -rf "${distName}"
  popd
}

packageElectronWindows() {
  local productName="$1"
  local pkgVersion="$2"

  # Windows
  pnpm exec quasar build -m electron -T win
  cp \
    "dist/electron/Packaged/${productName} Setup ${pkgVersion%%+*}.exe" \
    "dist/artifact/${productName} Setup ${pkgVersion}.exe"

  pushd "dist/electron/Packaged"
  cp -rv "win-unpacked" "${productName} ${pkgVersion}"
  zip -r "../../artifact/${productName} ${pkgVersion}.zip" "${productName} ${pkgVersion}"
  rm -rf "${productName} ${pkgVersion}"
  popd

}
packageElectronLinux() {
  local pkgName="$1"
  local productName="$2"
  local pkgVersion="$3"

  # Linux
  pnpm exec quasar build -m electron -T linux
  cp \
    "dist/electron/Packaged/${productName}-${pkgVersion%%+*}.AppImage" \
    "dist/artifact/${productName}-${pkgVersion}.AppImage"
  cp \
    "dist/electron/Packaged/${pkgName}_${pkgVersion%%+*}_amd64.snap" \
    "dist/artifact/${pkgName}_${pkgVersion}_amd64.snap"

  pushd "dist/electron/Packaged"
  cp -rv "linux-unpacked" "${productName}_${pkgVersion}"
  tar -zcf "../../artifact/${productName}_${pkgVersion}.tar.gz" "${productName}_${pkgVersion}"
  rm -rf "${productName}_${pkgVersion}"
  popd
}

createRelease() {
  local pkgVersion="$1"

  local releaseFlags=()
  if [[ "${NODE_ENV:=}" != "production" ]]; then
    releaseFlags=("${releaseFlags[@]}" "--prerelease")
  fi

  contrib/extract-changelog.py \
    | gh release create \
      --notes-file - \
      "${releaseFlags[@]}" \
      "v${pkgVersion}" \
      ./dist/artifact/*
}

clean() {
  rm -rf "dist/artifact"
  mkdir -p "dist/artifact"
}

onExit() {
  cd "$REPO_ROOT"

  clean
  resetVersion
}

main() {
  local pkgVersion pkgName productName

  pkgName="$(jq -r ".name" package.json)"
  pkgVersion="$(generateVersion)"
  productName="$(jq -r ".productName" package.json)"

  setVersion "$pkgVersion"

  # Package and push release
  packageSinglePageApp "$pkgName" "$pkgVersion"
  packageElectronWindows "$productName" "$pkgVersion"
  packageElectronLinux "$pkgName" "$productName" "$pkgVersion"
  createRelease "$pkgVersion"

  contrib/push-github-pages.sh
}

trap onExit EXIT
main "$@"
