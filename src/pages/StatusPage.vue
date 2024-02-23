<template>
  <q-page class="justify-evenly">
    <div class="row">
      <div class="col col-auto q-pa-md"></div>
    </div>
    <div class="row">
      <div class="col">
        <router-view
          :systems="systemStore.systems"
          :fronters="frontersStore.fronters"
        />
      </div>
    </div>
  </q-page>
  <q-footer elevated class="bg-primary text-white">
    <q-toolbar>
      <q-tabs v-model="activeTab" align="left" class="bg-primary">
        <q-route-tab
          to="/status/table"
          name="table"
          color="primary"
          icon="table_view"
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
      <table-settings v-if="activeTab == 'table'" />
      <list-settings v-if="activeTab == 'list'" />
      <tile-settings v-if="activeTab == 'tile'" />
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useSystemStore } from 'src/stores/system-store';
import { useFrontersStore } from 'src/stores/fronters-store';
import TableSettings from 'src/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from 'src/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from 'src/components/StatusPage/Settings/TileSettings.vue';

const systemStore = useSystemStore();
const frontersStore = useFrontersStore();

const activeTab = ref('');

async function updateSystemInfo() {
  for (const system of Object.values(systemStore.systems)) {
    if (
      !Object.prototype.hasOwnProperty.call(frontersStore.fronters, system.id)
    ) {
      frontersStore.addFronters(system.id);
      return; //  Only update one at a time
    }
  }

  const oldestEntry = Object.values(frontersStore.fronters).sort((a, b) =>
    a.lastUpdated > b.lastUpdated ? 1 : -1,
  )[0];

  // Don't update if it was more recently than 5 seconds ago
  if (Date.now() - oldestEntry.lastUpdated > 5000) {
    frontersStore.updateFronters(oldestEntry.system);
  }
}

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  updateSystemInfo();
  updateInterval = setInterval(updateSystemInfo, 5000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
