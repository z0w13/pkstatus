<template>
  <q-page>
    <router-view
      :systems="systemStore.systems"
      :fronters="frontersStore.fronters"
    />
  </q-page>
  <q-footer>
    <q-toolbar>
      <q-tabs v-model="activeTab" align="left" class="bg-primary">
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
      <table-settings v-if="activeTab == 'table'" />
      <list-settings v-if="activeTab == 'list'" />
      <tile-settings v-if="activeTab == 'tile'" />
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSystemStore } from 'src/stores/system-store';
import { useFrontersStore } from 'src/stores/fronters-store';
import TableSettings from 'src/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from 'src/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from 'src/components/StatusPage/Settings/TileSettings.vue';

const systemStore = useSystemStore();
const frontersStore = useFrontersStore();

const activeTab = ref('');
</script>
