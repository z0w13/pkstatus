<template>
  <router-view v-if="!loading" :new-version="newVersion" />
  <q-linear-progress v-else query />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { APIError } from 'pkapi.js';
import { useServices } from 'src/lib/Services';
import useCachePersister from 'src/components/CachePersister';
import setupErrorHandler from 'src/errorHandler';
import {
  UpdateInfo,
  checkForUpdate,
  shouldCheckForUpdates,
} from 'src/lib/check-update';
import { useRouter } from 'vue-router';

const $q = useQuasar();

const loading = ref(true);
const settingsStore = useSettingsStore();
const { pluralKit } = useServices();

const newVersion = ref<UpdateInfo | null>(null);
const router = useRouter();
const persister = useCachePersister();

const { dark, ignoreVersion, token } = storeToRefs(settingsStore);

// Force dark/light mode based on URL
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

watch(
  token,
  async (newVal) => {
    try {
      await pluralKit.setToken(newVal);
      loading.value = false;
    } catch (e) {
      if (e instanceof APIError && e.status == '401') {
        $q.notify({
          type: 'negative',
          message: 'PluralKit API Token Is Incorrect',
          caption: 'Please update or clear your token',
        });
        await router.push('/settings');
        loading.value = false;
      } else {
        throw e;
      }
    }
  },
  {
    immediate: true,
  },
);

async function updateChecker() {
  const update = await checkForUpdate();
  if (update && update.version == ignoreVersion.value) {
    return;
  }

  newVersion.value = update;
}

let updateCheckerInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  persister.restore();
  pluralKit.api.start();

  if (
    !updateCheckerInterval &&
    // Don't even check for updates if this is a web-based version
    shouldCheckForUpdates($q)
  ) {
    updateChecker();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    updateCheckerInterval = setInterval(updateChecker, 60 * 60 * 1000);
  }
});

onUnmounted(() => {
  if (updateCheckerInterval) {
    clearInterval(updateCheckerInterval);
    updateCheckerInterval = null;
  }
});
</script>
