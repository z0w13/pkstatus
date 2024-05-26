<template>
  <q-page>
    <router-view
      v-if="!!ids.length"
      :ids="ids"
      :systems="systems"
      :fronters="fronters"
    />
    <instructions-page v-else />
  </q-page>
  <q-footer v-if="!!ids.length">
    <q-toolbar>
      <q-tabs v-model="status.lastLayout" align="left" class="bg-primary">
        <q-route-tab
          to="/status/table"
          name="table"
          color="primary"
          icon="table_chart"
        />
        <q-route-tab
          to="/status/list"
          name="list"
          color="primary"
          icon="view_list"
        />
        <q-route-tab
          to="/status/tile"
          name="tile"
          color="primary"
          icon="grid_view"
        />
      </q-tabs>
      <q-space />
      <table-settings v-if="status.lastLayout == 'table'" />
      <list-settings v-if="status.lastLayout == 'list'" />
      <tile-settings v-if="status.lastLayout == 'tile'" />
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

import { useSystemStore } from 'src/stores/system-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { useServices } from 'src/lib/Services';

import TableSettings from 'src/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from 'src/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from 'src/components/StatusPage/Settings/TileSettings.vue';
import InstructionsPage from 'src/pages/status/InstructionsPage.vue';
import useStatusUpdater from 'src/components/StatusUpdater';

const { fronterCache, systemCache } = useServices();
const systemStore = useSystemStore();
const { status } = storeToRefs(useSettingsStore());
const { ids } = storeToRefs(systemStore);
const fronters = fronterCache.objects;
const systems = systemCache.objects;
const statusUpdater = useStatusUpdater();

onMounted(statusUpdater.start);
onUnmounted(statusUpdater.stop);
</script>
