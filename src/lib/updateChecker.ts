import axios from 'axios';
import { z } from 'zod';
import { QVueGlobals } from 'quasar';

import { getVersion, isPrerelease } from 'src/util';
import { compareBuild, gt, valid } from 'semver';

const ReleaseAsset = z.object({
  name: z.string(),
  url: z.string(),
  browser_download_url: z.string(),
});
type ReleaseAsset = z.infer<typeof ReleaseAsset>;

const ReleaseResponse = z.object({
  name: z.string().nullable(),
  tag_name: z.string(),
  body: z.string(),
  html_url: z.string(),
  assets: z.array(ReleaseAsset),
});
type ReleaseResponse = z.infer<typeof ReleaseResponse>;

export class UpdateInfo {
  constructor(
    public version: string,
    public changelog: string,
    public url: string,
    public assets: {
      android: string | null;
      windows: string | null;
      appimage: string | null;
      snap: string | null;
    },
  ) {}

  static async fromRelease(release: ReleaseResponse): Promise<UpdateInfo> {
    const newVersion = release.tag_name;
    const changelog = (
      await axios.get(
        `https://raw.githubusercontent.com/z0w13/pkstatus/${newVersion}/CHANGELOG.md`,
      )
    ).data
      .replaceAll(/\[(.*)\]\(.*?\)/g, '$1')
      .replaceAll(/^## /g, '---\n##');

    return new UpdateInfo(newVersion, changelog, release.html_url, {
      android:
        release.assets.find((a: ReleaseAsset) => a.name.endsWith('.apk'))
          ?.browser_download_url ?? null,
      windows:
        release.assets.find((a: ReleaseAsset) => a.name.endsWith('.exe'))
          ?.browser_download_url ?? null,
      appimage:
        release.assets.find((a: ReleaseAsset) => a.name.endsWith('.AppImage'))
          ?.browser_download_url ?? null,
      snap:
        release.assets.find((a: ReleaseAsset) => a.name.endsWith('.snap'))
          ?.browser_download_url ?? null,
    });
  }
}

async function getReleases(): Promise<Array<ReleaseResponse>> {
  return (
    z
      .array(ReleaseResponse)
      .parse(
        (
          await axios.get(
            'https://api.github.com/repos/z0w13/pkstatus/releases',
          )
        ).data,
      )
      // filter releases that aren't semver
      .filter((r) => !!valid(r.tag_name))
      // sort by version descending
      .toSorted((a, b) => compareBuild(b.tag_name, a.tag_name))
  );
}

export function isValidUpdateTarget(
  currentVersion: string,
  newVersion: string,
): boolean {
  return (
    // prerelease -> prerelease (newer)
    (isPrerelease(currentVersion) &&
      isPrerelease(newVersion) &&
      gt(newVersion, currentVersion)) ||
    // prerelease -> release (newer)
    (isPrerelease(currentVersion) &&
      !isPrerelease(newVersion) &&
      gt(newVersion, currentVersion)) ||
    // release -> release (newer)
    (!isPrerelease(currentVersion) &&
      !isPrerelease(newVersion) &&
      gt(newVersion, currentVersion))
  );
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  const releases = await getReleases();

  const currVer = getVersion();
  const targets = releases.filter((r) =>
    isValidUpdateTarget(currVer, r.tag_name),
  );

  if (targets.length === 0) {
    return null;
  }
  console.info({ targets });

  return await UpdateInfo.fromRelease(targets[0]);
}

export function shouldCheckForUpdates($q: QVueGlobals): boolean {
  return !!$q.platform.is.electron || !!$q.platform.is.capacitor;
}
