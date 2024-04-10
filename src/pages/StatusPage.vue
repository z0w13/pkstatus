<template>
  <q-page>
    <router-view :ids="ids" :systems="systems" :fronters="fronters" />
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
import { storeToRefs } from 'pinia';

import { useSystemStore } from 'src/stores/system-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { useServices } from 'src/lib/Services';

import TableSettings from 'src/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from 'src/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from 'src/components/StatusPage/Settings/TileSettings.vue';

const { fronterCache, systemCache } = useServices();

const { status } = storeToRefs(useSettingsStore());
const { ids } = storeToRefs(useSystemStore());
const fronters = fronterCache.objects;
const systems = systemCache.objects;
</script>
