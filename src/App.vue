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
    if (!frontersStore.fronters[system.id]) {
      frontersStore.addFronters(system.id);
      return; // Only update one at a time
    }
  }

  for (const system of systemStore.getOutdated(
    settingsStore.systemUpdateInterval,
  )) {
    systemStore.updateSystem(system.id);
    return; // Only update one at a time
  }

  for (const fronters of frontersStore.getOutdated(
    settingsStore.fronterUpdateInterval,
  )) {
    frontersStore.updateFronters(fronters.system);
    return; // Only update one at a time
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
