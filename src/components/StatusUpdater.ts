import { APIError } from 'pkapi.js';
import { useQuasar } from 'quasar';
import { useServices } from 'src/lib/Services';
import { useSettingsStore } from 'src/stores/settings-store';
import { useSystemStore } from 'src/stores/system-store';

export default function useStatusUpdater() {
  let updateInterval: ReturnType<typeof setInterval> | null = null;

  const $q = useQuasar();
  const { fronterCache, systemCache } = useServices();
  const systemStore = useSystemStore();
  const settings = useSettingsStore();

  function start() {
    if (!updateInterval) {
      updateSystemInfo();
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
        if (!systemCache.has(system)) {
          return await systemCache.fetch(system);
        }

        if (!fronterCache.has(system)) {
          return await fronterCache.fetch(system);
        }
      } catch (e) {
        if (!(e instanceof APIError)) {
          throw e;
        }

        return $q.notify({
          type: 'negative',
          message: `Error updating fronters for '${(await systemCache.get(system))?.name || system}'`,
          caption: `${e.status}: ${e.message} (${e.code})`,
        });
      }
    }

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

    for (const fronters of systemStore.getExpiredFronters(
      settings.fronterUpdateInterval * multiplyInterval,
    )) {
      try {
        return await fronterCache.fetch(fronters.system);
      } catch (e) {
        if (!(e instanceof APIError)) {
          throw e;
        }

        return $q.notify({
          type: 'negative',
          message: `Error updating fronters for '${(await systemCache.get(fronters.system))?.name || fronters.system}'`,
          caption: `${e.status}: ${e.message} (${e.code})`,
        });
      }
    }
  }

  return {
    start,
    stop,
  };
}
