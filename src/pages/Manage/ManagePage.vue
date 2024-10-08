<template>
  <q-page class="row justify-evenly">
    <div class="col col-md-auto">
      <page-title icon="manage_accounts" text="Systems" />
      <q-table
        :grid="$q.screen.lt.sm"
        :columns="columns"
        :rows="tableData"
        row-key="name"
        class="bg-lighten"
        :card-container-class="{
          column: true,
          'q-mx-md': true,
          'q-list': true,
          'q-list--separator': false,
          'q-list--bordered': false,
          'q-list--dark': $q.dark.isActive,
        }"
        flat
      >
        <template #body-cell-avatar="props">
          <q-td :props="props">
            <initial-fallback-avatar
              v-if="props.value !== undefined"
              :url="props.value"
              :name="props.row.name"
              size="24px"
            />
            <q-skeleton v-else type="circle" size="24px" />
          </q-td>
        </template>
        <template #body-cell-id="props">
          <q-td :props="props">
            {{ formatId(props.row.id, idOpts) }}
          </q-td>
        </template>
        <template #body-cell-name="props">
          <q-td :props="props">
            <template v-if="props.value">{{ props.value }}</template>
            <q-skeleton v-else type="rect" />
          </q-td>
        </template>
        <template #body-cell-buttons="props">
          <q-td :props="props">
            <q-btn-group unelevated>
              <q-btn
                dense
                icon="delete"
                color="negative"
                @click="deleteSystem(props.row.id)"
              />
            </q-btn-group>
          </q-td>
        </template>

        <!-- Grid Layout -->
        <template #item="props">
          <q-item class="q-pa-sm">
            <q-item-section avatar>
              <q-avatar :color="props.row.avatarUrl ? '' : 'primary'">
                <img v-if="props.row.avatarUrl" :src="props.row.avatarUrl" />
                <template v-else>
                  {{
                    (props.row.displayName || props.row.name).substring(0, 1)
                  }}
                </template>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ props.row.name }}</q-item-label>
              <q-item-label caption>{{
                formatId(props.row.id, idOpts)
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                @click="deleteSystem(props.row.id)"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-table>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to="/manage/add" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { QTableProps, useQuasar } from 'quasar';

import { useSystemStore } from 'src/stores/system-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { useServices } from 'src/lib/Services';

import PageTitle from 'src/components/PageTitle.vue';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import { formatId, is404 } from 'src/util';

const $q = useQuasar();
const systemStore = useSystemStore();
const settings = useSettingsStore();
const { id: idOpts } = storeToRefs(settings);
const { systemCache, pluralKit } = useServices();

const columns: QTableProps['columns'] = [
  { name: 'avatar', field: 'avatarUrl', label: 'Icon', align: 'left' },
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  { name: 'name', field: 'name', label: 'Name', align: 'left' },
  {
    name: 'note',
    field: 'note',
    label: 'Note',
    align: 'left',
    headerStyle: 'width: 100%',
  },
  { name: 'buttons', field: '', label: '' },
];

const tableData = computed(() =>
  systemStore.ids.map((id) => systemCache.objects[id] || { id }),
);

function deleteSystem(id: string) {
  systemStore.delete(id);
  $q.notify('System Deleted');
}

// Make sure systems get fetched and cached
onMounted(() => {
  systemStore.ids.forEach(async (id) => {
    try {
      await pluralKit.getSystem(id);
    } catch (e) {
      if (is404(e)) {
        $q.notify({
          type: 'negative',
          message: `Error fetching ${systemCache.getCached(id)?.name || formatId(id, idOpts.value)}`,
          caption: `${e.status}: ${e.message} (${e.code})`,
        });
      }
    }
  });
});
</script>
