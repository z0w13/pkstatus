<template>
  <q-item-label header>Logging Settings</q-item-label>
  <q-item tag="label">
    <q-item-section>
      <q-select
        v-model="log.level"
        label="Log Level"
        :options="[
          { value: 'debug', label: 'Debug' },
          { value: 'info', label: 'Info' },
          { value: 'warn', label: 'Warnings' },
          { value: 'error', label: 'Errors' },
        ]"
        emit-value
        map-options
      >
        <template #prepend>
          <q-icon name="notes" />
        </template>
      </q-select>
    </q-item-section>
  </q-item>
  <q-item tag="label">
    <q-item-section>
      <q-item-label>Max Lines</q-item-label>
      <q-item-label caption>
        How many lines should we store in the log
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-input
        v-model="logLines"
        type="number"
        :error="!!errorMessage"
        :error-message="errorMessage"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useSettingsStore } from 'src/stores/settings-store';
import { LOG_MAX_LINES, LOG_MIN_LINES } from 'src/models/Settings';

const settings = useSettingsStore();
const { log } = storeToRefs(settings);
const logLines = ref(log.value.lines.toString());
const errorMessage = ref<string | undefined>(undefined);

watch(
  () => logLines.value,
  () => {
    const intVal = parseInt(logLines.value);
    if (isNaN(intVal)) {
      errorMessage.value = 'should be a number';
      return;
    }

    if (intVal < LOG_MIN_LINES || intVal > LOG_MAX_LINES) {
      errorMessage.value = 'should be a value between 0 and 1000';
      return;
    }

    errorMessage.value = undefined;
    log.value.lines = intVal;
  },
);
</script>
