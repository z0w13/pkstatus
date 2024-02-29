<template>
  <q-page class="row justify-evenly">
    <div class="col col-md-auto">
      <q-table
        :grid="$q.screen.lt.sm"
        title="Systems"
        :columns="columns"
        :rows="Object.values(systemStore.systems)"
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
        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <img width="24" :src="props.value" />
          </q-td>
        </template>
        <template v-slot:body-cell-buttons="props">
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
        <template v-slot:item="props">
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
              <q-item-label caption>{{ props.row.id }}</q-item-label>
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
import { QTableProps, useQuasar } from 'quasar';
import { useSystemStore } from 'src/stores/system-store';

const $q = useQuasar();
const systemStore = useSystemStore();

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

function deleteSystem(id: string) {
  systemStore.deleteSystem(id);
  $q.notify('System Deleted');
}
</script>