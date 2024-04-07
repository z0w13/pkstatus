<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from './stores/settings-store';
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemStore } from './stores/system-store';
import { APIError } from 'pkapi.js';
import { useCacheStore } from './stores/cache-store';
import { System, SerializedSystem } from './models/System';
import { Fronters, SerializedFronters } from './models/Fronters';
import { Member, SerializedMember } from './models/Member';
import { z } from 'zod';

const $q = useQuasar();

const settingsStore = useSettingsStore();
const systemStore = useSystemStore();
const { fronterCache, systemCache } = useCacheStore();

const { dark, systemUpdateInterval, fronterUpdateInterval } =
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

const PersistedCache = z.object({
  systems: z.array(SerializedSystem),
  fronters: z.array(SerializedFronters),
  members: z.array(SerializedMember),
});
// NOTE: Disabled because somehow we get a false positive for a non-exported
//       const + type combo
// eslint-disable-next-line no-redeclare
type PersistedCache = z.infer<typeof PersistedCache>;

function persistCache() {
  const sysIds = useSystemStore().ids;
  const { systemCache, memberCache, fronterCache } = useCacheStore();

  const cacheData: PersistedCache = {
    systems: Object.values(systemCache.objects)
      .filter((s) => sysIds.includes(s.id))
      .map((s) => s.toStorage()),
    fronters: Object.values(fronterCache.objects)
      .filter((f) => sysIds.includes(f.system))
      .map((f) => f.toStorage()),
    members: Object.values(memberCache.objects)
      .filter((m) => sysIds.includes(m.system))
      .map((m) => m.toStorage()),
  };

  localStorage.setItem('persisted-cache', JSON.stringify(cacheData));
}

function restoreCache() {
  const { systemCache, memberCache, fronterCache } = useCacheStore();
  const persistedCache = localStorage.getItem('persisted-cache');
  if (!persistedCache) {
    return;
  }

  const parsedCache = PersistedCache.parse(JSON.parse(persistedCache));
  parsedCache.systems
    .map((s) => System.fromStorage(s))
    .forEach((s) => systemCache.set(s));

  parsedCache.members
    .map((m) => Member.fromStorage(m))
    .forEach((m) => memberCache.set(m));

  parsedCache.fronters
    .map((f) => Fronters.fromStorage(f, memberCache.getMultiCached(f.members)))
    .forEach((f) => fronterCache.set(f));
}

// Data update logic
async function updateSystemInfo() {
  for (const system of systemStore.ids) {
    try {
      if (!systemCache.has(system)) {
        await systemCache.fetch(system);
        persistCache();
        return;
      }

      if (!fronterCache.has(system)) {
        await fronterCache.fetch(system);
        persistCache();
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
      persistCache();
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
      persistCache();
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

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  restoreCache();
  updateSystemInfo();
  updateInterval = setInterval(updateSystemInfo, 1000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
