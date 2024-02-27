<template>
  <div class="col-10">
    <div class="row justify-left q-pa-md">
      <div class="col-auto">
        <q-markup-table flat>
          <thead>
            <th>System</th>
            <th :colspan="maxFront">Fronters</th>
            <th v-if="settings.showLastSwitch">Last Switch</th>
            <th v-if="settings.showUpdateTime">Last Update</th>
          </thead>
          <tbody>
            <tr :key="id" v-for="[id, system] in Object.entries(systems)">
              <td>
                <q-avatar
                  v-if="system.avatarUrl"
                  square
                  :size="settings.iconSize + 'px'"
                >
                  <q-img :ratio="1" :src="system.avatarUrl">
                    <template v-slot:error>
                      <q-icon
                        :size="`${settings.iconSize}px`"
                        class="absolute-center"
                        color="grey"
                        name="broken_image"
                      />
                    </template>
                  </q-img>
                </q-avatar>
                <q-avatar
                  v-else
                  square
                  color="primary"
                  icon="groups"
                  :size="`${settings.iconSize}px`"
                />
                {{ system.name }}
                <q-tooltip v-if="system.description">
                  <pre class="description">{{ system.description }}</pre>
                </q-tooltip>
              </td>
              <template v-if="fronters[id]">
                <template v-if="fronters[id].allowed">
                  <td :key="fronter.id" v-for="fronter of fronters[id].members">
                    <q-avatar
                      v-if="fronter.avatarUrl"
                      square
                      :size="settings.iconSize + 'px'"
                    >
                      <q-img :ratio="1" :src="fronter.avatarUrl">
                        <template v-slot:error>
                          <q-icon
                            :size="`${settings.iconSize}px`"
                            class="absolute-center"
                            color="grey"
                            name="broken_image"
                          />
                        </template>
                      </q-img>
                    </q-avatar>
                    <q-avatar
                      v-else
                      color="primary"
                      icon="person"
                      square
                      :size="settings.iconSize + 'px'"
                    />
                    {{ fronter.displayName || fronter.name }}

                    <q-tooltip v-if="fronter.description">
                      <pre class="description">{{ fronter.description }}</pre>
                    </q-tooltip>
                  </td>
                  <td
                    v-if="maxFront - fronters[id].members.length > 0"
                    :colspan="maxFront - fronters[id].members.length"
                  ></td>
                </template>
                <!-- No Access -->
                <td v-else>
                  <q-avatar
                    color="red"
                    icon="close"
                    square
                    :size="settings.iconSize + 'px'"
                  />
                  No Access
                </td>
              </template>
              <!-- Loading -->
              <td v-else>
                <q-linear-progress query />
              </td>
              <!-- Last Switch -->
              <td v-if="settings.showLastSwitch && fronters[id]">
                <relative-time-display :time="fronters[id].lastSwitch" />
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
import { computed } from 'vue';

import { Fronters } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { System } from 'src/models/System';

import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const settings = useSettingsStore().status.table;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

const props = defineProps<Props>();

const maxFront = computed(() =>
  Math.max(...Object.values(props.fronters).map((f) => f.members.length)),
);
</script>
