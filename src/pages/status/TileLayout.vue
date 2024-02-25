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
        <div class="col-auto text-italic">
          Last updated
          <relative-time-display :time="fronters[id].lastUpdated" />
        </div>
      </div>
      <div
        class="row justify-left"
        v-if="settings.showLastSwitch && fronters[id]"
      >
        <div class="col-auto text-italic">
          Last switch
          <relative-time-display
            v-if="!!fronters[id].lastSwitch"
            :time="fronters[id].lastSwitch"
          />
          <template v-else>unknown</template>
        </div>
      </div>
      <div class="row justify-left q-pa-md q-col-gutter-md">
        <system-view
          :system="system"
          :fronters="fronters[id]"
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
import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';

import SystemView from 'src/components/StatusPage/Tile/SystemView.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const settings = useSettingsStore().status.tile;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
