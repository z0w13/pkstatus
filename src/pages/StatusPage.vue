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

import { useSystemStore } from '@/stores/system-store';
import { useSettingsStore } from '@/stores/settings-store';

import TableSettings from '@/components/StatusPage/Settings/TableSettings.vue';
import ListSettings from '@/components/StatusPage/Settings/ListSettings.vue';
import TileSettings from '@/components/StatusPage/Settings/TileSettings.vue';
import InstructionsPage from '@/pages/status/InstructionsPage.vue';
import useStatusUpdater from '@/components/StatusUpdater';
import { usePluralKit } from '@/boot/pluralKit';

const pluralKit = usePluralKit();
const systemStore = useSystemStore();
const { status } = storeToRefs(useSettingsStore());
const { ids } = storeToRefs(systemStore);
const fronters = pluralKit.fronterCache.objects;
const systems = pluralKit.systemCache.objects;
const statusUpdater = useStatusUpdater();

onMounted(statusUpdater.start);
onUnmounted(statusUpdater.stop);
</script>
