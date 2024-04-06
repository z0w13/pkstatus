<template>
  <div
    :class="['row', `justify-${settings.horizontalPosition}`]"
    style="min-height: inherit"
  >
    <div :class="['col', 'col-lg-auto', `self-${settings.verticalPosition}`]">
      <q-markup-table flat>
        <thead>
          <tr :style="`line-height: ${settings.iconSize * 1.1}px`">
            <th>System</th>
            <th
              :colspan="useMobileUi ? 1 : maxFront + 1"
              :style="{ width: useMobileUi ? 'auto' : '100%' }"
            >
              Fronters
            </th>
            <th v-if="settings.showLastSwitch">Last Switch</th>
            <th v-if="settings.showUpdateTime">Last Update</th>
          </tr>
        </thead>
        <tbody>
          <tr
            :key="id"
            v-for="[id, system] in Object.entries(systems)"
            :style="`line-height: ${settings.iconSize}px`"
          >
            <td valign="top">
              <table-entity
                :img="system.avatarUrl"
                :size="settings.iconSize + 'px'"
                :tooltip="system.description"
                :label="system.getName(detectPronouns)"
                :caption="system.getPronouns(detectPronouns)"
                @click="dialog.show({ system })"
                :square="settings.squareIcons"
              />
            </td>
            <template v-if="fronters[id]">
              <template v-if="fronters[id].allowed">
                <td v-if="useMobileUi" valign="top" style="padding-bottom: 0">
                  <table-entity
                    v-for="member of fronters[id].members"
                    :key="member.id"
                    :img="member.avatarUrl"
                    :size="settings.iconSize + 'px'"
                    :tooltip="member.description"
                    :label="member.getName(detectPronouns)"
                    :caption="member.getPronouns(detectPronouns)"
                    @click="dialog.show({ member, system })"
                    class="q-mb-sm"
                    :square="settings.squareIcons"
                  />
                </td>
                <template v-else>
                  <td
                    valign="top"
                    style="width: 1%"
                    :key="member.id"
                    v-for="member of fronters[id].members"
                  >
                    <table-entity
                      :img="member.avatarUrl"
                      :size="settings.iconSize + 'px'"
                      :tooltip="member.description"
                      :label="member.getName(detectPronouns)"
                      :caption="member.getPronouns(detectPronouns)"
                      @click="dialog.show({ member, system })"
                      :square="settings.squareIcons"
                    />
                  </td>
                  <td
                    v-if="maxFront - fronters[id].members.length > 0"
                    :colspan="maxFront - fronters[id].members.length"
                  ></td>
                </template>
              </template>
              <!-- No Access -->
              <template v-else>
                <td>
                  <table-entity
                    label="No Access"
                    :size="settings.iconSize + 'px'"
                    icon="close"
                    color="red"
                    :square="settings.squareIcons"
                  />
                </td>
                <td
                  v-if="maxFront > 1 && !useMobileUi"
                  :colspan="maxFront - 1"
                ></td>
              </template>
            </template>
            <!-- Loading -->
            <td v-else valign="middle">
              <q-linear-progress query />
            </td>
            <!-- Spacer -->
            <td v-if="!useMobileUi" />
            <!-- Last Switch -->
            <td v-if="settings.showLastSwitch" valign="top">
              <relative-time-display :time="fronters[id]?.lastSwitch" />
            </td>
            <!-- Last Updated -->
            <td v-if="settings.showUpdateTime" valign="top">
              <relative-time-display :time="fronters[id]?.lastUpdated" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>

  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { Fronters } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { System } from 'src/models/System';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import TableEntity from 'src/pages/status/Table/TableEntity.vue';

const $q = useQuasar();

const settingsStore = useSettingsStore();
const { detectPronouns } = storeToRefs(settingsStore);
const settings = settingsStore.status.table;

const useMobileUi = computed(() => $q.screen.lt.sm || settings.forceMobileUi);
const dialog = ref();

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

const props = defineProps<Props>();

const maxFront = computed(() =>
  Math.max(...Object.values(props.fronters).map((f) => f.members.length)),
);
</script>
