<template>
  <router-view :new-version="newVersion" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from './stores/settings-store';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from './stores/system-store';
import { APIError } from 'pkapi.js';
import { useServices } from 'src/lib/Services';
import { CachePersister } from './lib/CachePersister';
import { UpdateInfo, checkForUpdate } from './lib/check-update';

const $q = useQuasar();

const settingsStore = useSettingsStore();
const systemStore = useSystemStore();
const { fronterCache, systemCache, memberCache } = useServices();
const persister = new CachePersister(systemCache, memberCache, fronterCache);
const newVersion = ref<UpdateInfo | null>(null);

const { dark, systemUpdateInterval, fronterUpdateInterval, ignoreVersion } =
  storeToRefs(settingsStore);

switch (window.location.hash.split('#').at(-1)) {
  case 'dark':
    dark.value = true;
    break;
  case 'light':
    dark.value = false;
    break;
}

// Watch for changes to dark mode and update the UI
watch(dark, (newVal) => $q.dark.set(newVal), {
  immediate: true,
});
watch(fronterUpdateInterval, (newVal) => fronterCache.setTtl(newVal), {
  immediate: true,
});
watch(systemUpdateInterval, (newVal) => systemCache.setTtl(newVal), {
  immediate: true,
});

// Data update logic
async function updateSystemInfo() {
  for (const system of systemStore.ids) {
    try {
      if (!systemCache.has(system)) {
        await systemCache.fetch(system);
        persister.persist(systemStore.ids);
        return;
      }

      if (!fronterCache.has(system)) {
        await fronterCache.fetch(system);
        persister.persist(systemStore.ids);
        return;
      }
    } catch (e) {
      if (!(e instanceof APIError)) {
        throw e;
      }

      return $q.notify({
        type: 'negative',
        message: `Error updating fronters for '${(await systemCache.get(system))?.name}'`,
        caption: `${e.status}: ${e.message} (${e.code})`,
      });
    }
  }

  for (const system of systemStore.getExpired()) {
    try {
      await systemStore.update(system.id);
      persister.persist(systemStore.ids);
      return;
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

  for (const fronters of fronterCache.getExpired()) {
    try {
      await fronterCache.fetch(fronters.system);
      persister.persist(systemStore.ids);
      return;
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

async function updateChecker() {
  const update = await checkForUpdate();
  if (update && update.version == ignoreVersion.value) {
    return;
  }

  newVersion.value = update;
}

let updateInterval: ReturnType<typeof setInterval> | null = null;
let updateCheckerInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  persister.restore();
  if (!updateInterval) {
    updateSystemInfo();
    updateInterval = setInterval(updateSystemInfo, 1000);
  }

  if (
    !updateCheckerInterval &&
    // Don't even check for updates if this is a web-based version
    ($q.platform.is.electron || $q.platform.is.capacitor)
  ) {
    updateChecker();
    updateCheckerInterval = setInterval(updateChecker, 60 * 60 * 1000);
  }
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  if (updateCheckerInterval) {
    clearInterval(updateCheckerInterval);
    updateCheckerInterval = null;
  }
});
</script>
