<template>
  <q-item-label header>Backup & Restore</q-item-label>
  <q-item>
    <q-item-section>
      <q-btn
        color="positive"
        label="backup"
        :href="backupFileUrl"
        :download="backupFile.name"
      />
    </q-item-section>
    <q-item-section>
      <q-btn color="negative" label="restore" @click="fileInput?.click()" />
      <input
        ref="fileInput"
        accept=".json"
        type="file"
        style="display: none"
        @change="handleRestore"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, ref } from 'vue';

import { useSystemStore } from 'src/stores/system-store';

import { migrate as migrateSettings } from 'src/models/migrations/settings';
import { migrate as migrateSystems } from 'src/models/migrations/system';
import { useSettingsStore } from 'src/stores/settings-store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const settingsStore = useSettingsStore();
const systemStore = useSystemStore();

const fileInput = ref<HTMLInputElement>();
const emit = defineEmits(['restore']);

function createBackupFile(): File {
  const backupData = {
    settings: JSON.parse(localStorage.getItem('settings') || '{}'),
    systems: JSON.parse(localStorage.getItem('systems') || '{}'),
  };
  backupData.settings.settings.token = null;

  return new File(
    [JSON.stringify(backupData, null, 2)],
    `PKStatus-${dayjs().format('YYYYMMDD_HHmmss')}.json`,
    { type: 'application/json' },
  );
}

const backupFile = ref(createBackupFile());
const backupFileUrl = computed(() => URL.createObjectURL(backupFile.value));

async function handleRestore() {
  if (!fileInput.value?.files) {
    return;
  }

  const file = fileInput.value.files[0];
  if (!file) {
    return;
  }

  try {
    const parsed = JSON.parse(await file.text());
    const settings = migrateSettings(parsed.settings);
    const systems = migrateSystems(parsed.systems);

    $q.dialog({
      title: 'Warning!',
      message:
        'This will overwrite all your PKStatus settings and tracked systems, ' +
        'are you sure?',
      persistent: true,
      ok: {
        push: true,
        icon: 'warning',
        label: 'Yes, Overwrite!',
        color: 'negative',
      },
      cancel: {
        push: true,
        color: 'primary',
      },
    }).onOk(() => {
      if (!settings.settings.token) {
        settings.settings.token = settingsStore.token;
      }

      localStorage.setItem('settings', JSON.stringify(settings));
      localStorage.setItem('systems', JSON.stringify(systems));

      settingsStore.$hydrate();
      systemStore.$hydrate();

      $q.notify({
        icon: 'check',
        type: 'positive',
        message: 'Backup restored!',
      });

      emit('restore');
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      $q.notify({
        icon: 'error',
        type: 'negative',
        message: 'Error parsing backup file',
        caption: e.message,
      });
    } else {
      throw e;
    }
  }
}
</script>
