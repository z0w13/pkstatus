<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <div class="row q-pa-md">
        <div class="col">
          <q-form filled @submit="onSubmit" class="q-gutter-md">
            <q-input filled v-model="newId" label="systemRef" />

            <div>
              <q-btn label="Add" type="submit" color="primary" />
            </div>
          </q-form>
        </div>
      </div>
      <div class="row q-pa-md">
        <div class="col">
          <q-table
            title="Systems"
            :columns="columns"
            :rows="systems"
            row-key="name"
            flat
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td>
                  <img width="24" :src="props.row.avatar_url" />
                </q-td>
                <q-td>{{ props.row.id }}</q-td>
                <q-td>
                  {{ props.row.name }}
                </q-td>
                <q-td>
                  {{ props.row.note }}
                </q-td>
                <q-td>
                  <q-btn
                    icon="delete"
                    color="negative"
                    @click="onDelete(props.row.id)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSystemStore } from 'src/stores/system-store';

const columns = [
  { name: 'avatar_url', field: 'avatar_url', label: 'Icon' },
  { name: 'id', field: 'id', label: 'ID' },
  { name: 'name', field: 'name', label: 'Name' },
  { name: 'note', field: 'note', label: 'Note' },
  { name: 'buttons', field: '', label: '' },
];

const newId = ref('');
const systemStore = useSystemStore();

const systems = computed(() => Object.values(systemStore.systems));

async function onSubmit() {
  if (newId.value.length > 0) {
    systemStore.addSystem(newId.value);
    newId.value = '';
  }
}

async function onDelete(id: string) {
  systemStore.deleteSystem(id);
}
</script>
