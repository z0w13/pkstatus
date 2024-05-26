<template>
  <router-view v-if="!loading" :new-version="newVersion" />
  <q-linear-progress v-else query />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';
import { getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { APIError } from 'pkapi.js';
import { useServices } from 'src/lib/Services';
import useCachePersister from 'src/components/CachePersister';
import {
  UpdateInfo,
  checkForUpdate,
  shouldCheckForUpdates,
} from 'src/lib/check-update';
import { useLogStore } from 'src/stores/log-store';
import { useRouter } from 'vue-router';
import { isDev } from 'src/util';

const $q = useQuasar();

const loading = ref(true);
const settingsStore = useSettingsStore();
const { fronterCache, systemCache, pluralKit } = useServices();

const newVersion = ref<UpdateInfo | null>(null);
const router = useRouter();
const persister = useCachePersister();

const {
  dark,
  systemUpdateInterval,
  fronterUpdateInterval,
  ignoreVersion,
  token,
} = storeToRefs(settingsStore);

function logStack(err: unknown): void {
  const stackErr = err as unknown as { stack?: string };
  if (typeof stackErr?.stack === 'string') {
    useLogStore().log(stackErr.stack);
  }
}
function handleError(err: unknown): void {
  if (err instanceof APIError) {
    logStack(err);
    useLogStore().log(`API Error: ${JSON.stringify(err, null, 2)}`);
    $q.notify({
      type: 'warning',
      message: 'API Error',
      caption: err.message ?? err.statusText,
    });
    return;
  }
  if (err instanceof Error) {
    logStack(err);
    useLogStore().log(`${err.name}: ${err.message}`);
    $q.notify({
      type: 'warning',
      message: `${err.name}: ${err.message}`,
    });
    return;
  }

  if (typeof err === 'string') {
    useLogStore().log(`Error: ${err}`);
    $q.notify({
      type: 'warning',
      message: err,
    });
    return;
  }

  logStack(err);
  useLogStore().log(`Error: ${String(err)} | ${JSON.stringify(err, null, 2)}`);
  $q.notify({
    type: 'warning',
    message: `${String(err)} | ${JSON.stringify(err, null, 2)}`,
  });
}

const app = getCurrentInstance()?.appContext.app;
if (app && !isDev()) {
  window.onerror = (_event, _source, _lineno, _colno, error) => {
    handleError(error);
  };
  app.config.errorHandler = (error) => {
    handleError(error);
  };
}

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
watch(fronterUpdateInterval, (newVal) => fronterCache.setTtl(newVal), {
  immediate: true,
});
watch(systemUpdateInterval, (newVal) => systemCache.setTtl(newVal), {
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
