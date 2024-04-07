<template>
  <div class="col-12">
    <template :key="id" v-for="id of ids">
      <div class="row justify-left q-pa-md q-col-gutter-md">
        <system-view
          :system="systems[id]"
          :fronters="fronters[id]"
          :detect-pronouns="detectPronouns"
          :show-system-description="settings.showSystemDescription"
          :show-fronter-description="settings.showFronterDescription"
          :show-update-time="settings.showUpdateTime"
          :show-last-switch="settings.showLastSwitch"
          :card-width="settings.tileSize"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Fronters } from 'src/models/Fronters';
import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';

import SystemView from 'src/components/StatusPage/Tile/SystemView.vue';

const settingsStore = useSettingsStore();
const { detectPronouns } = storeToRefs(settingsStore);
const settings = settingsStore.status.tile;

export interface Props {
  ids: Array<string>;
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
