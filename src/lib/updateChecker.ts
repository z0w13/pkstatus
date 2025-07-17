import axios from 'axios';
import { z } from 'zod';
import { QVueGlobals } from 'quasar';

import { getVersion, isPrerelease } from 'src/util';

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

export interface UpdateInfo {
  version: string;
  changelog: string;
  url: string;
  assets: {
    android: string | null;
    windows: string | null;
  };
}

async function getLatestRelease(): Promise<ReleaseResponse> {
  return ReleaseResponse.parse(
    (
      await axios.get(
        'https://api.github.com/repos/z0w13/pkstatus/releases/latest',
      )
    ).data,
  );
}

function isValidUpdateTarget(
  currentVersion: string,
  newVersion: string,
): boolean {
  return (
    // prerelease -> prerelease
    (isPrerelease(currentVersion) && isPrerelease(newVersion)) ||
    // prerelease -> release
    (isPrerelease(currentVersion) && !isPrerelease(newVersion)) ||
    // release -> release
    (!isPrerelease(currentVersion) && !isPrerelease(newVersion))
  );
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  const latest = await getLatestRelease();

  const currVer = getVersion();
  const newVer = latest.tag_name;

  if (isValidUpdateTarget(currVer, newVer)) {
    if (newVer !== currVer) {
      return {
        version: newVer,
        changelog: (
          await axios.get(
            `https://raw.githubusercontent.com/z0w13/pkstatus/${newVer}/CHANGELOG.md`,
          )
        ).data
          .replaceAll(/\[(.*)\]\(.*?\)/g, '$1')
          .replaceAll(/^## /g, '---\n##'),
        url: latest.html_url,
        assets: {
          android:
            latest.assets.find((a: ReleaseAsset) => a.name.endsWith('.apk'))
              ?.browser_download_url || null,
          windows:
            latest.assets.find((a: ReleaseAsset) => a.name.endsWith('.exe'))
              ?.browser_download_url || null,
        },
      };
    }
  }

  return null;
}

export function shouldCheckForUpdates($q: QVueGlobals): boolean {
  return !!$q.platform.is.electron || !!$q.platform.is.capacitor;
}
