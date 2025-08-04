import { APIError } from 'pkapi-ts/errors';
import { useQuasar } from 'quasar';
import { usePluralKit } from 'boot/pluralKit';
import { useSettingsStore } from 'src/stores/settings-store';
import { useSystemStore } from 'src/stores/system-store';

export default function useStatusUpdater() {
  let updateInterval: ReturnType<typeof setInterval> | null = null;
  let lastUpdated: 'system' | 'fronters' = 'fronters';

  const $q = useQuasar();
  const pluralKit = usePluralKit();
  const systemStore = useSystemStore();
  const settings = useSettingsStore();

  function start() {
    if (!updateInterval) {
      updateSystemInfo();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      updateInterval = setInterval(updateSystemInfo, 1000);
    }
  }

  function stop() {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  }

  const systemCount = systemStore.ids.length;
  const avgRequestsPerSecond =
    systemCount / settings.systemUpdateInterval +
    systemCount / settings.fronterUpdateInterval;

  const targetReqsPerSec = 1.5; // Leave a bit of wiggle room, current max is 2
  const multiplyInterval =
    avgRequestsPerSecond > targetReqsPerSec
      ? avgRequestsPerSecond / targetReqsPerSec
      : 1;

  // Update logic for status display
  async function updateSystemInfo() {
    for (const system of systemStore.ids) {
      try {
        if (!pluralKit.systemCache.has(system)) {
          return await pluralKit.getSystem(system);
        }

        if (!pluralKit.fronterCache.has(system)) {
          return await pluralKit.getFronters(system);
        }
      } catch (e) {
        if (!(e instanceof APIError)) {
          throw e;
        }

        return $q.notify({
          type: 'negative',
          message: `Error updating fronters for '${pluralKit.systemCache.get(system)?.name || system}'`,
          caption: `${e.status}: ${e.message} (${e.code})`,
        });
      }
    }

    if (lastUpdated == 'fronters') {
      lastUpdated = 'system';

      for (const system of systemStore.getExpired(
        settings.systemUpdateInterval * multiplyInterval,
      )) {
        try {
          return await systemStore.update(system.id);
        } catch (e) {
          if (!(e instanceof APIError)) {
            throw e;
          }

          return $q.notify({
            type: 'negative',
            message: `Error updating '${system.name}'`,
            caption: `${e.status}: ${e.message} (${e.code})`,
          });
        }
      }
    } else {
      lastUpdated = 'fronters';

      for (const fronters of systemStore.getExpiredFronters(
        settings.fronterUpdateInterval * multiplyInterval,
      )) {
        try {
          return await pluralKit.getFronters(fronters.system, {
            skipCache: true,
          });
        } catch (e) {
          if (!(e instanceof APIError)) {
            throw e;
          }

          return $q.notify({
            type: 'negative',
            message: `Error updating fronters for '${pluralKit.systemCache.get(fronters.system)?.name || fronters.system}'`,
            caption: `${e.status}: ${e.message} (${e.code})`,
          });
        }
      }
    }
  }

  return {
    start,
    stop,
  };
}
