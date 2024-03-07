import { Command, Option } from '@commander-js/extra-typings';
import fs from 'node:fs/promises';
import semver from 'semver';
import { spawn as baseSpawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';
import tmp, { withFile } from 'tmp-promise';

const GITHUB_URL = 'https://github.com/z0w13/pkstatus';
const GIT_URL = 'git@github.com:z0w13/pkstatus.git';
const COMPARE_URL = `${GITHUB_URL}/compare`;
const PKG_NAME = 'pkstatus';

async function withDir<T extends (...args: any) => any>(
  dir: string,
  inner: T,
): ReturnType<T> {
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
const ROOT_DIR = path.dirname(__dirname);

async function getPkgJson() {
  return JSON.parse(await fs.readFile('package.json', 'utf-8'));
}
async function getVersion() {
  return (await getPkgJson()).version;
}

async function getLatestChangelog() {
  return (await fs.readFile('CHANGELOG.md', 'utf-8'))
    .split(/^## /m)
    .slice(0, 2)
    .join('## ')
    .trim();
}

async function pushGithubPages() {
  // Don't forget to set PKSTATUS_BUILD_MODE=gh-pages
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
  .action(async ({ dryRun, major, minor, version }) => {
    const pkgJson = await getPkgJson();

    // Bump version
    const currVersion = pkgJson.version;
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

    console.info(`Bumping version from ${currVersion} to ${newVersion}`);

    // Write new version to package.json
    pkgJson.version = newVersion;
    if (!dryRun) {
      await fs.writeFile('package.json', JSON.stringify(pkgJson, null, 2));
    }
    console.info(
      'Wrote new version to package.json' + (dryRun ? ' (skipped)' : ''),
    );

    // Generate changelog template
    const changelog = (await fs.readFile('CHANGELOG.md', 'utf-8')).split('\n');
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
      await fs.writeFile('CHANGELOG.md', newChangelog.join('\n'));
    }
    console.info(
      'Added new version in CHANGELOG.md' + (dryRun ? ' (skipped)' : ''),
    );
  });

program
  .command('tag')
  .description('Commit and tag release')
  .action(async () => {
    const version = await getVersion();

    await run(['git', 'add', 'CHANGELOG.md', 'package.json']);
    await run(['git', 'commit', '-m', `chore(release): release v${version}`]);
    await run(['git', 'tag', '-am', `release v${version}`, `v${version}`]);
  });

program
  .command('package')
  .description('Build packages')
  .requiredOption('--ks, --keystore <keystore>')
  .action(async ({ keystore }) => {
    const version = await getVersion();
    const outDir = path.join(ROOT_DIR, `dist/_artifacts/v${version}`);

    // Create artifact directory if it doesn't exist
    await run(['mkdir', '--verbose', '--parents', outDir], true);

    // 1. Create SPA in 2 variants (subdir and no subdir) and tar them
    console.info('Building SPA...');
    await run(['pnpm', 'exec', 'quasar', 'build', '--mode', 'spa']);
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

    // 2. Create windows setup executable
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
    ]);
    await fs.copyFile(
      `${ROOT_DIR}/dist/electron/Packaged/PKStatus Setup ${version}.exe`,
      `${outDir}/win-pkstatus-v${version}-x64-setup.exe`,
    );

    // 3. Create Linux snap/appimage/tar.gz
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
    ]);
    await fs.copyFile(
      `${ROOT_DIR}/dist/electron/Packaged/PKStatus-${version}.AppImage`,
      `${outDir}/linux-pkstatus-v${version}-x64.AppImage`,
    );
    await fs.copyFile(
      `${ROOT_DIR}/dist/electron/Packaged/pkstatus_${version}_amd64.snap`,
      `${outDir}/linux-pkstatus-v${version}-x64.snap`,
    );

    // 4. Create Android APK
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
    ]);
    // 4a. zipalign
    console.info('ZIP Aligning APK...');
    await run(
      [
        'zipalign',
        '-vp',
        '4',
        'dist/capacitor/android/apk/release/app-release-unsigned.apk',
        'dist/capacitor/android/apk/release/app-release-unsigned-aligned.apk',
      ],
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
        'dist/capacitor/android/apk/release/app-release-unsigned-aligned.apk',
        '--out',
        `${outDir}/android-pkstatus-v${version}.apk`,
      ],
      true,
    );
    // 4c. cleanup
    await fs.unlink(`${outDir}/android-pkstatus-v${version}.apk.idsig`);
  });

program
  .command('publish')
  .description('Publish release')
  .action(async () => {
    const version = await getVersion();
    const outDir = path.join(ROOT_DIR, `dist/_artifacts/v${version}`);

    // 1. Push branch and tags
    console.info(`Pushing main branch and tags...`);
    await run(['git', 'push', 'origin', 'main', '--follow-tags']);

    // 2. Create draft release
    console.info(`Creating release v${version}...`);
    withFile(async ({ path }) => {
      await fs.writeFile(path, await getLatestChangelog());
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
    for (const file of await fs.readdir(outDir)) {
      console.info(` * Uploading ${file}...`);
      await run(
        ['gh', 'release', 'upload', `v${version}`, path.join(outDir, file)],
        true,
      );
    }

    // 4. Push to github pages
    console.info('Building GitHub pages build...');
    await spawn('pnpm', ['exec', 'quasar', 'build', '--mode', 'pwa'], {
      env: {
        ...process.env,
        PKSTATUS_BUILD_MODE: 'gh-pages',
      },
      stdio: 'inherit',
    });
    console.info('Pushing to GitHub pages...');
    withDir(path.join(ROOT_DIR, 'dist/pwa'), async () => {
      await run(['git', 'init', '--branch', 'gh-pages'], true);
      await run(['git', 'remote', 'add', 'origin', GIT_URL], true);
      await run(['git', 'add', '.'], true);
      await run(['git', 'commit', '-m', `Generated v${version}`], true);
      await run(['git', 'push', 'origin', 'gh-pages', '--force'], true);
    });

    // 5. Publish the release draft
    console.info(`Publishing release v${version}...`);
    await run(
      ['gh', 'release', 'edit', `v${version}`, '--draft=false', '--latest'],
      true,
    );
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
  .action(async () => {
    console.log(getLatestChangelog());
  });

tmp.setGracefulCleanup();
process.chdir(ROOT_DIR);
program.parse();
