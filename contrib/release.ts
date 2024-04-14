import { Command, Option } from '@commander-js/extra-typings';
import fs from 'node:fs';
import semver from 'semver';
import { spawn as baseSpawn, spawnSync } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import tmp, { withFile } from 'tmp-promise';
import chalk from 'chalk';
import assert from 'node:assert';

const GITHUB_URL = 'https://github.com/z0w13/pkstatus';
const GIT_PROD_URL = 'git@github.com:z0w13/pkstatus.git';
const GIT_DEV_URL = 'git@github.com:z0w13/pkstatus-dev.git';
const COMPARE_URL = `${GITHUB_URL}/compare`;
const PKG_NAME = 'pkstatus';
const ROOT_DIR = path.dirname(__dirname);

const BUMP_VERSION = ['package.json', 'src-capacitor/package.json'];

async function withDir<T>(dir: string, inner: () => T) {
  const origDir = process.cwd();
  process.chdir(dir);
  const retVal = await inner();
  process.chdir(origDir);
  return retVal;
}

async function spawn(
  ...args: Parameters<typeof baseSpawn>
): Promise<number | null> {
  return new Promise((resolve, reject) => {
    const proc = baseSpawn(...args);
    proc.on('close', (code) => resolve(code));
    proc.on('error', (err) => reject(err));
  });
}
async function run(
  args: Array<string>,
  output = false,
): Promise<number | null> {
  return await spawn(args[0], args.slice(1), {
    stdio: output ? 'inherit' : 'ignore',
  });
}

async function getOutput(args: Array<string>): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawnSync(args[0], args.slice(1));
    resolve(proc.stdout.toString().trim());
  });
}

function getPkgJson(filename = 'package.json') {
  return JSON.parse(fs.readFileSync(filename, 'utf-8'));
}

function getVersion(): string {
  const pkgJson = getPkgJson();
  assert(typeof pkgJson.version === 'string');
  return getPkgJson().version;
}

function setVersion(filename: string, version: string): void {
  const json = getPkgJson(filename);
  json.version = version;
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));
}

function createOrGetOutDir(version: string): string {
  const outDir = path.join(ROOT_DIR, `dist/_artifacts/v${version}`);
  fs.mkdirSync(outDir, { recursive: true });

  return outDir;
}

// Commands
function getLatestChangelog() {
  return fs
    .readFileSync('CHANGELOG.md', 'utf-8')
    .split(/^## /m)
    .slice(0, 2)
    .join('## ')
    .trim();
}

function isDev(version: string): boolean {
  return version.includes('-dev');
}
function devFlag(version: string): Array<string> {
  return isDev(version) ? ['--debug'] : [];
}

async function pushGithubPages(version: string) {
  console.info('Building GitHub pages build...');
  await spawn(
    'pnpm',
    ['exec', 'quasar', 'build', '--mode', 'pwa', ...devFlag(version)],
    {
      env: {
        ...process.env,
        PKSTATUS_SPA_PREFIX: isDev(version) ? '/pkstatus-dev' : '/pkstatus',
      },
      stdio: 'inherit',
    },
  );
  console.info('Pushing to GitHub pages...');
  await withDir(path.join(ROOT_DIR, 'dist/pwa'), async () => {
    await run(['git', 'init', '--initial-branch', 'gh-pages'], true);
    await run(['git', 'remote', 'add', 'prod-pages', GIT_PROD_URL], true);
    await run(['git', 'remote', 'add', 'dev-pages', GIT_DEV_URL], true);
    await run(['git', 'add', '.'], true);
    await run(['git', 'commit', '-m', `Generated v${version}`], true);
    await run(
      [
        'git',
        'push',
        isDev(version) ? 'dev-pages' : 'prod-pages',
        'gh-pages',
        '--force',
      ],
      true,
    );
  });
}

async function buildSpa() {
  const version = getVersion();
  const outDir = createOrGetOutDir(version);

  console.info('Building SPA...');
  await run([
    'pnpm',
    'exec',
    'quasar',
    'build',
    '--mode',
    'spa',
    ...devFlag(version),
  ]);
  // 1a. Create SPA with subdir
  await run([
    'tar',
    '--verbose',
    '--create',
    '--gzip',
    `--transform=s/^spa/spa-${PKG_NAME}-v${version}/`,
    `--file=${outDir}/spa-pkstatus-v${version}.tar.gz`,
    `--directory=${ROOT_DIR}/dist`,
    'spa',
  ]);
  // 1b. Create SPA without subdir
  await run([
    'tar',
    '--create',
    '--gzip',
    `--file=${outDir}/spa-pkstatus-v${version}-nosubdir.tar.gz`,
    `--directory=${ROOT_DIR}/dist/spa`,
    '.',
  ]);
}

async function buildElectronWin() {
  const version = getVersion();
  const outDir = createOrGetOutDir(version);

  console.info('Building Electron (Win)...');
  await run([
    'pnpm',
    'exec',
    'quasar',
    'build',
    '--mode',
    'electron',
    '--target',
    'win',
    ...devFlag(version),
  ]);
  fs.copyFileSync(
    `${ROOT_DIR}/dist/electron/Packaged/PKStatus Setup ${version.split('+')[0]}.exe`,
    `${outDir}/win-pkstatus-v${version}-x64-setup.exe`,
  );
}

async function buildElectronNix() {
  const version = getVersion();
  const outDir = createOrGetOutDir(version);

  console.info('Building Electron (Linux)...');
  await run([
    'pnpm',
    'exec',
    'quasar',
    'build',
    '--mode',
    'electron',
    '--target',
    'linux',
    ...devFlag(version),
  ]);
  fs.copyFileSync(
    `${ROOT_DIR}/dist/electron/Packaged/PKStatus-${version.split('+')[0]}.AppImage`,
    `${outDir}/linux-pkstatus-v${version}-x64.AppImage`,
  );
  fs.copyFileSync(
    `${ROOT_DIR}/dist/electron/Packaged/pkstatus_${version.split('+')[0]}_amd64.snap`,
    `${outDir}/linux-pkstatus-v${version}-x64.snap`,
  );
}

async function buildAndroidPackage(keystore: string) {
  const version = getVersion();
  const outDir = createOrGetOutDir(version);

  console.info('Building Capacitor (Android)...');
  await run([
    'pnpm',
    'exec',
    'quasar',
    'build',
    '--mode',
    'capacitor',
    '--target',
    'android',
    ...devFlag(version),
  ]);

  // 4a. zipalign
  console.info('ZIP Aligning APK...');
  const apkPath =
    'dist/capacitor/android/apk/' +
    (isDev(version)
      ? '/debug/app-debug.apk'
      : 'release/app-release-unsigned.apk');
  await run(
    ['zipalign', '-vp', '4', apkPath, apkPath.replace('.apk', '-aligned.apk')],
    true,
  );

  // 4b. sign
  console.info('Signing APK...');
  await run(
    [
      'apksigner',
      'sign',
      '--ks',
      keystore,
      '--in',
      apkPath.replace('.apk', '-aligned.apk'),
      '--out',
      `${outDir}/android-pkstatus-v${version}.apk`,
    ],
    true,
  );
  // 4c. cleanup
  fs.unlinkSync(`${outDir}/android-pkstatus-v${version}.apk.idsig`);
}

const program = new Command();
program
  .name('release.ts')
  .description('Tool for authoring releases for PKStatus');

program
  .command('new')
  .description('Prepare a release')
  .option('-n, --dry-run', "Don't make any changes to files")
  .addOption(new Option('--major').conflicts(['minor', 'version']))
  .addOption(new Option('--minor').conflicts(['major', 'version']))
  .addOption(new Option('--version <version>').conflicts(['major', 'minor']))
  .option('--dev')
  .action(async ({ dryRun, major, minor, version, dev }) => {
    const currVersion = getVersion();

    // Bump version
    let newVersion: string | null;
    if (version) {
      newVersion = version;
    } else if (major) {
      newVersion = semver.inc(currVersion, 'major');
    } else if (minor) {
      newVersion = semver.inc(currVersion, 'minor');
    } else {
      newVersion = semver.inc(currVersion, 'patch');
    }

    if (!newVersion) {
      throw new Error("Couldn't bump version");
    }

    if (dev) {
      newVersion += `-dev${await getOutput([
        'git',
        'rev-list',
        '--count',
        'HEAD',
      ])}+sha.${await getOutput(['git', 'rev-parse', '--short', 'HEAD'])}`;
    }

    console.info(`Bumping version from ${currVersion} to ${newVersion}`);

    // Write new version to package.json
    if (!dryRun) {
      // TODO: Remove `newVersion &&` as soon as we can upgrade to Typescript 5.4
      BUMP_VERSION.forEach((f) => newVersion && setVersion(f, newVersion));
    }

    console.info(
      'Wrote new version to package.json' + (dryRun ? ' (skipped)' : ''),
    );

    // Generate changelog template
    const changelog = fs.readFileSync('CHANGELOG.md', 'utf-8').split('\n');
    const currDate = new Date().toISOString().split('T')[0];
    const changelogAddition = [
      `## [${newVersion}](${COMPARE_URL}/v${currVersion}...v${newVersion}) (${currDate})`,
      '',
      '',
      '### Features',
      '',
      '',
      '### Bug Fixes',
      '',
    ];
    const newChangelog = [
      ...changelog.slice(0, 2),
      ...changelogAddition,
      ...changelog.slice(2),
    ];

    if (!dryRun) {
      fs.writeFileSync('CHANGELOG.md', newChangelog.join('\n'));
    }
    console.info(
      'Added new version in CHANGELOG.md' + (dryRun ? ' (skipped)' : ''),
    );
  });

program
  .command('tag')
  .description('Commit and tag release')
  .action(async () => {
    const version = getVersion();

    await run(['git', 'add', 'CHANGELOG.md', ...BUMP_VERSION]);
    await run(['git', 'commit', '-m', `chore(release): release v${version}`]);
    await run(['git', 'tag', '-am', `release v${version}`, `v${version}`]);
  });

program
  .command('package')
  .description('Build packages')
  .requiredOption('--ks, --keystore <keystore>')
  .action(async ({ keystore }) => {
    // 1. Create SPA in 2 variants (subdir and no subdir) and tar them
    await buildSpa();

    // 2. Create windows setup executable
    await buildElectronWin();

    // 3. Create Linux snap/appimage/tar.gz
    await buildElectronNix();

    // 4. Create Android APK
    await buildAndroidPackage(keystore);
  });

program.command('build-spa').description('Build SPA').action(buildSpa);
program
  .command('build-win')
  .description('Build Windows Electron App')
  .action(buildElectronWin);
program
  .command('build-nix')
  .description('Build Linux Electron App')
  .action(buildElectronNix);

program
  .command('build-android')
  .description('Build an Android APK')
  .requiredOption('--ks, --keystore <keystore>')
  .action(async ({ keystore }) => {
    await buildAndroidPackage(keystore);
  });

program
  .command('publish')
  .description('Publish release')
  .action(async () => {
    const version = getVersion();
    const outDir = path.join(ROOT_DIR, `dist/_artifacts/v${version}`);

    // 1. Push branch and tags
    console.info(
      `Pushing ${isDev(version) ? 'dev' : 'main'} branch and tags...`,
    );
    await run([
      'git',
      'push',
      'origin',
      isDev(version) ? 'dev' : 'main',
      '--follow-tags',
    ]);

    // 2. Create draft release
    console.info(`Creating release v${version}...`);
    await withFile(async ({ path }) => {
      fs.writeFileSync(path, getLatestChangelog());
      await run([
        'gh',
        'release',
        'create',
        `v${version}`,
        '--draft',
        '--notes-file',
        path,
      ]);
    });

    // 3. Loop through release artifacts and add them to the release draft
    for (const file of fs.readdirSync(outDir)) {
      console.info(` * Uploading ${file}...`);
      await run(
        ['gh', 'release', 'upload', `v${version}`, path.join(outDir, file)],
        true,
      );
    }

    // 4. Push to github pages
    await pushGithubPages(version);

    // 5. Publish the release draft
    console.info(`Publishing release v${version}...`);
    await run(
      [
        'gh',
        'release',
        'edit',
        `v${version}`,
        '--draft=false',
        isDev(version) ? '--prerelease' : '--latest',
      ],
      true,
    );
  });

program
  .command('gh-pages')
  .description('Push to GitHub pages')
  .action(async () => {
    const version = getVersion();
    await pushGithubPages(version);
  });

program
  .command('clean')
  .description('Clean temp files')
  .action(() => {
    // 1. run quasar's clean
    // 2. delete build artifacts
  });

program
  .command('get-changelog')
  .description('Print changelog for latest version')
  .action(() => console.log(getLatestChangelog()));

function checkItem(
  check: boolean,
  checkMessage: string,
  successMessage: string,
  failMessage: string,
): boolean {
  const colorFunc = check ? chalk.green : chalk.red;
  const logFunc = check ? console.info : console.error;

  logFunc(
    colorFunc(
      `[${check ? '✓' : '✘'}] ${checkMessage} ${check ? successMessage : failMessage}`,
    ),
  );

  return check;
}
async function check(): Promise<boolean> {
  console.info('Checking prereqs...');
  let pass = true;

  // Check for gh binary
  pass =
    pass &&
    checkItem(
      (await run(['which', 'gh'])) !== 1,
      "'gh' binary",
      'installed',
      "missing, can't create releases",
    );
  // Check for misc binaries
  pass =
    pass &&
    checkItem(
      (await run(['which', 'tar'])) !== 1,
      "'tar' binary",
      'installed',
      "missing, can't package releases",
    );
  // Check for android binaries
  pass =
    pass &&
    checkItem(
      (await run(['which', 'zipalign'])) !== 1,
      "'zipalign' binary",
      'installed',
      "missing, can't create android releases",
    );
  pass =
    pass &&
    checkItem(
      (await run(['which', 'apksigner'])) !== 1,
      "'apksigner' binary",
      'installed',
      "missing, can't create android releases",
    );

  return pass;
}

program.hook('preAction', async () => {
  if (!(await check())) {
    process.exit(1);
  }
});

tmp.setGracefulCleanup();
process.chdir(ROOT_DIR);
program.parse();
