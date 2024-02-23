<template>
  <div class="container col-10">
    <div class="row justify-left q-pa-md">
      <div class="col-auto"></div>
    </div>
    <template :key="id" v-for="[id, system] in Object.entries(systems)">
      <div
        class="row justify-left"
        v-if="settings.showUpdateTime && fronters[id]"
      >
        <div class="col-auto">
          <relative-time-display :time="fronters[id].lastUpdated" />
        </div>
      </div>
      <div class="row justify-left q-pa-md q-col-gutter-md">
        <system-view
          :system="system"
          :fronters="fronters[id]"
          :show-update-time="settings.showUpdateTime"
          :show-system-description="settings.showSystemDescription"
          :show-fronter-description="settings.showFronterDescription"
          :card-width="settings.tileSize"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Fronters } from 'src/stores/fronters-store';
import { ExtendedSystem } from 'src/stores/system-store';
import SystemView from 'src/components/StatusPage/SystemView.vue';
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore().status.tile;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, ExtendedSystem>;
}

defineProps<Props>();
</script>
