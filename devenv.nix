{
  pkgs,
  lib,
  config,
  ...
}:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [
    gh
    gnutar

    # required for windows build
    winePackages.minimal
  ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.cargo-watch.exec = "cargo-watch";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  # scripts.hello.exec = ''
  #   echo hello from $GREET
  # '';

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-slim_22;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.java = {
    enable = true;
    gradle.enable = true;
    jdk.package = pkgs.jetbrains.jdk-no-jcef;
  };

  android = {
    enable = true;
    buildTools.version = [ "34.0.0" ];
    platforms.version = [ "35" ];
    emulator.enable = false;
    googleAPIs.enable = false;
    googleTVAddOns.enable = false;
    ndk.enable = false;
    systemImages.enable = false;
  };

  enterShell =
    let
      env = config.env;
      androidCfg = config.android;
      pnpmCfg = config.languages.javascript.pnpm;
    in
    # bash
    ''
      export PATH="$PATH:${env.ANDROID_HOME}/build-tools/${lib.lists.head androidCfg.buildTools.version}"

      # setting GRADLE_OPTS currently breaks things
      # TODO: See if this is fixed after updating capacitor
      #export -n GRADLE_OPTS

      # run pnpm install if dependencies changed
      function _devenv-local-pnpm-install() {
        local folder="$1"

        local actual
        local ACTUAL_PNPM_CHECKSUM="${pnpmCfg.package.version}:$(${pkgs.nix}/bin/nix-hash --type sha256 ''${folder}/pnpm-lock.yaml)"
        local PNPM_CHECKSUM_FILE="''${folder}/node_modules/pnpm-lock.yaml.checksum"

        if [ -f "$PNPM_CHECKSUM_FILE" ]; then
          read -r EXPECTED_PNPM_CHECKSUM < "$PNPM_CHECKSUM_FILE"
        else
          EXPECTED_PNPM_CHECKSUM=""
        fi

        if [ "$ACTUAL_PNPM_CHECKSUM" != "$EXPECTED_PNPM_CHECKSUM" ]; then
          if ${pnpmCfg.package}/bin/pnpm install --dir "''${folder}"; then
            echo "$ACTUAL_PNPM_CHECKSUM" > "$PNPM_CHECKSUM_FILE"
          else
            echo "Install failed. Run 'pnpm install' manually."
          fi
        fi
      }

      _devenv-local-pnpm-install "src-capacitor"
    '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
