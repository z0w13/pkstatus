<template>
  <div class="col-10">
    <div class="row justify-left q-pa-md">
      <div class="col-auto">
        <q-markup-table flat>
          <tbody>
            <tr :key="id" v-for="[id, system] in Object.entries(systems)">
              <td>
                <q-avatar
                  v-if="system.avatar_url"
                  square
                  :size="settings.iconSize + 'px'"
                >
                  <img :src="system.avatar_url" />
                </q-avatar>
                <q-avatar
                  v-else
                  square
                  color="primary"
                  icon="people"
                  :size="settings.iconSize + 'px'"
                />
                {{ system.name }}
              </td>
              <template v-if="fronters[id]">
                <template v-if="fronters[id].allowed">
                  <td
                    :key="fronter.id"
                    v-for="fronter of fronters[id].members"
                    :inset-level="1"
                  >
                    <q-avatar
                      v-if="fronter.avatar_url"
                      square
                      :size="settings.iconSize + 'px'"
                    >
                      <img :src="fronter.avatar_url" />
                    </q-avatar>
                    <q-avatar
                      v-else
                      color="primary"
                      icon="person"
                      square
                      :size="settings.iconSize + 'px'"
                    />
                    {{ fronter.display_name || fronter.name }}
                  </td>
                </template>
                <!-- No Access -->
                <td v-else>No Access To Fronters</td>
              </template>
              <!-- Loading -->
              <td v-else>
                <q-linear-progress query />
              </td>
              <!-- Last Updated -->
              <td v-if="settings.showUpdateTime && fronters[id]">
                <relative-time-display :time="fronters[id].lastUpdated" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fronters } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { ExtendedSystem } from 'src/stores/system-store';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const settings = useSettingsStore().status.table;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, ExtendedSystem>;
}

defineProps<Props>();
</script>
