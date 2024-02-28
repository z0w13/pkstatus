<template>
  <div class="col-12">
    <template :key="id" v-for="[id, system] in Object.entries(systems)">
      <div class="row justify-left q-pa-md q-col-gutter-md">
        <system-view
          :system="system"
          :fronters="fronters[id]"
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
import { Fronters } from 'src/stores/fronters-store';
import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';

import SystemView from 'src/components/StatusPage/Tile/SystemView.vue';

const settings = useSettingsStore().status.tile;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
