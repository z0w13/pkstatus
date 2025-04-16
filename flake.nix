{
  description = "Description for the project";

  inputs = {
    devenv-root = {
      url = "file+file:///dev/null";
      flake = false;
    };
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    devenv.url = "github:cachix/devenv";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    inputs@{
      flake-parts,
      nixpkgs,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems = [
        "x86_64-linux"
        "i686-linux"
        "x86_64-darwin"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      perSystem =
        {
          lib,
          pkgs,
          system,
          config,
          ...
        }:
        {
          # https://devenv.sh/reference/options/

          _module.args.pkgs = import nixpkgs {
            inherit system;
            config.allowUnfreePredicate =
              pkg:
              builtins.elem (lib.getName pkg) [
                "android-sdk-tools"
                "android-sdk-cmdline-tools"
              ];
          };

          devenv.shells.default = {
            name = "pkstatus";

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
                env = config.devenv.shells.default.env;
                androidCfg = config.devenv.shells.default.android;
                pnpmCfg = config.devenv.shells.default.languages.javascript.pnpm;
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

            packages = with pkgs; [
              gh
              gnutar

              # required for windows build
              winePackages.minimal
            ];
          };
        };
    };
}
