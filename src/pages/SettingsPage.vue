<template>
  <q-page class="row justify-evenly">
    <div class="col col-sm-6 col-md-4">
      <q-card-section class="q-py-md">
        <div class="row items-center no-wrap">
          <div class="col-auto q-mr-sm">
            <q-icon name="settings" size="24px" />
          </div>
          <div class="col text-subtitle1">Settings</div>
        </div>
      </q-card-section>
      <q-list class="bg-lighten">
        <q-item>
          <q-item-section>
            <q-select
              label="System Update Interval"
              v-model="systemUpdateInterval"
              :options="options"
              emit-value
              map-options
              @update:model-value="onChange"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              label="Fronter Update Interval"
              v-model="fronterUpdateInterval"
              :options="options"
              emit-value
              map-options
              @update:model-value="onChange"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useSettingsStore } from 'src/stores/settings-store';

const $q = useQuasar();
const settingsStore = useSettingsStore();
const { systemUpdateInterval, fronterUpdateInterval } =
  storeToRefs(settingsStore);

function onChange() {
  $q.notify('Settings Updated');
}

const options = [
  { label: '10 Seconds', value: 10 },
  { label: '1 Minute', value: 60 },
  { label: '5 Minutes', value: 300 },
  { label: '1 Hour', value: 3600 },
  { label: '6 Hour', value: 3600 * 6 },
  { label: '1 Day', value: 86400 },
];
</script>
