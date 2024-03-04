<template>
  <q-page class="row justify-evenly">
    <div class="col col-sm-6 col-md-4">
      <page-title icon="settings" text="Settings" />
      <q-list class="bg-lighten">
        <q-item-label header>Display Settings</q-item-label>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Detect Pronouns</q-item-label>
            <q-item-label caption
              >Detect pronouns in system and member names and remove them, also
              shows them in the pronoun field if no pronouns are set
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="detectPronouns" />
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>Update Settings</q-item-label>
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

import PageTitle from 'src/components/PageTitle.vue';

const $q = useQuasar();
const settingsStore = useSettingsStore();
const { systemUpdateInterval, fronterUpdateInterval, detectPronouns } =
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
