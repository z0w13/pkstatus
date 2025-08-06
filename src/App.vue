<template>
  <router-view v-if="!loading" :new-version="newVersion" />
  <q-linear-progress v-else query />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { APIError } from 'pkapi-ts/errors';
import useCachePersister from 'src/components/CachePersister';
import setupErrorHandler, { logWithMessage } from 'src/errorHandler';
import {
  UpdateInfo,
  checkForUpdate,
  shouldCheckForUpdates,
} from 'src/lib/updateChecker';
import { useRouter } from 'vue-router';

import { usePluralKit } from 'boot/pluralKit';

// set up our custom error handler so errors get logged
setupErrorHandler();

const $q = useQuasar();

const loading = ref(true);
const settingsStore = useSettingsStore();

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

// restore the caches from local storage
useCachePersister().restore();

// Watch for changes to the pluralkit token and update the PluralKit API wrapper with it
watch(
  token,
  async (newVal) => {
    try {
      await usePluralKit().setToken(newVal);
      loading.value = false;
    } catch (e) {
      if (e instanceof APIError && e.status == 401) {
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
  try {
    const update = await checkForUpdate();
    if (update && update.version == ignoreVersion.value) {
      return;
    }

    newVersion.value = update;
  } catch (e) {
    logWithMessage('Error checking for updates', e);
    return;
  }
}

let updateCheckerInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  persister.restore();

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
