import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { getVersion, isDev } from 'src/util';

const UpdateAsset = z.object({
  name: z.string(),
  url: z.string(),
  browser_download_url: z.string(),
});
type UpdateAsset = z.infer<typeof UpdateAsset>;

const UpdateResponse = z.object({
  name: z.string().nullable(),
  tag_name: z.string(),
  body: z.string(),
  html_url: z.string(),
  assets: z.array(UpdateAsset),
});

export interface UpdateInfo {
  version: string;
  changelog: string;
  url: string;
  assets: {
    android: string | null;
    windows: string | null;
  };
}

export async function checkForUpdate(): Promise<UpdateInfo | null> {
  try {
    const resp = UpdateResponse.parse(
      (
        await axios.get(
          'https://api.github.com/repos/z0w13/pkstatus/releases/latest',
        )
      ).data,
    );

    const currVer = getVersion();
    const newVer = resp.tag_name;

    const currIsDev = isDev();
    const newIsDev = resp.tag_name.includes('dev');

    if ((currIsDev && newIsDev) || (!currIsDev && !newIsDev)) {
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
          url: resp.html_url,
          assets: {
            android:
              resp.assets.find((a: UpdateAsset) => a.name.endsWith('.apk'))
                ?.browser_download_url || null,
            windows:
              resp.assets.find((a: UpdateAsset) => a.name.endsWith('.exe'))
                ?.browser_download_url || null,
          },
        };
      }
    }
  } catch (e) {
    if (!(e instanceof AxiosError)) {
      throw e;
    }
  }

  return null;
}
