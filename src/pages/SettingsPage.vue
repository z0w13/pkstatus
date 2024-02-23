<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-6">
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>System Update Interval</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-slider
              :min="10"
              :max="86400"
              v-model="systemUpdateInterval"
              label
              label-always
              snap
              :step="10"
              :label-value="systemUpdateInterval + 's'"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Fronters Update Interval</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-slider
              :min="10"
              :max="3600"
              v-model="fronterUpdateInterval"
              label
              label-always
              snap
              :step="10"
              :label-value="fronterUpdateInterval + 's'"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup type="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const settingsStore = useSettingsStore()
const { systemUpdateInterval, fronterUpdateInterval } = storeToRefs(settingsStore)
</script>
