<template>
  <q-page>
    <router-view
      :systems="systemStore.systems"
      :fronters="frontersStore.fronters"
    />
  </q-page>
  <q-footer>
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
import { useSystemStore } from 'src/stores/system-store';
import { useFrontersStore } from 'src/stores/fronters-store';
import TableSettings from 'src/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from 'src/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from 'src/components/StatusPage/Settings/TileSettings.vue';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';

const systemStore = useSystemStore();
const frontersStore = useFrontersStore();

const { status } = storeToRefs(useSettingsStore());
</script>
