<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from './stores/settings-store';
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFrontersStore } from './stores/fronters-store';
import { useSystemStore } from './stores/system-store';
import { APIError } from 'pkapi.js';
import dayjs from 'dayjs';

const $q = useQuasar();

const settingsStore = useSettingsStore();
const systemStore = useSystemStore();
const frontersStore = useFrontersStore();

const { dark } = storeToRefs(settingsStore);

// Watch for changes to dark mode and update the UI
watch(dark, (newVal) => $q.dark.set(newVal), {
  immediate: true,
});

// Data update logic
async function updateSystemInfo() {
  for (const system of Object.values(systemStore.systems)) {
    try {
      if (!frontersStore.fronters[system.id]) {
        return await frontersStore.add(system.id);
      }
    } catch (e) {
      if (!(e instanceof APIError)) {
        throw e;
      }

      return $q.notify({
        type: 'negative',
        message: `Error updating fronters for '${system.name}'`,
        caption: `${e.status}: ${e.message} (${e.code})`,
      });
    }
  }

  for (const system of systemStore.getOutdated(
    settingsStore.systemUpdateInterval,
  )) {
    try {
      return await systemStore.update(system.id);
    } catch (e) {
      if (!(e instanceof APIError)) {
        throw e;
      }

      if (e.status == '404') {
        systemStore.systems[system.id].updatedAt = dayjs();
      }
      return $q.notify({
        type: 'negative',
        message: `Error updating '${system.name}'`,
        caption: `${e.status}: ${e.message} (${e.code})`,
      });
    }
  }

  for (const fronters of frontersStore.getOutdated(
    settingsStore.fronterUpdateInterval,
  )) {
    try {
      return await frontersStore.update(fronters.system);
    } catch (e) {
      if (!(e instanceof APIError)) {
        throw e;
      }

      if (e.status == '404') {
        frontersStore.fronters[fronters.system].lastUpdated = dayjs();
      }
      return $q.notify({
        type: 'negative',
        message: `Error updating fronters for '${systemStore.find(fronters.system)?.name || fronters.system}'`,
        caption: `${e.status}: ${e.message} (${e.code})`,
      });
    }
  }
}

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
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
