<template>
  <div
    :class="['row', `justify-${settings.horizontalPosition}`]"
    style="min-height: inherit"
  >
    <div :class="['col', 'col-lg-auto', `self-${settings.verticalPosition}`]">
      <q-markup-table :flat="$q.dark.isActive">
        <thead>
          <tr>
            <th align="left" :style="headerIconPaddingStyle">System</th>
            <th
              :colspan="useMobileUi ? 1 : maxFront + 1"
              :style="`width: ${useMobileUi ? 'auto' : '100%'}; ${headerIconPaddingStyle}`"
              align="left"
            >
              Fronters
            </th>
            <template v-if="useMobileUi">
              <th
                v-if="settings.showLastSwitch || settings.showUpdateTime"
                align="left"
              >
                <q-item dense class="q-pa-none">
                  <q-item-section class="col-auto">
                    <q-item-label v-if="settings.showLastSwitch">
                      Last Switch
                    </q-item-label>
                    <q-item-label
                      v-if="settings.showUpdateTime"
                      :caption="settings.showLastSwitch"
                    >
                      Last Update
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </th>
            </template>
            <template v-else>
              <th v-if="settings.showLastSwitch" align="left">Last Switch</th>
              <th v-if="settings.showUpdateTime" align="left">Last Updated</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="id in ids" :key="id" :style="rowLineHeight">
            <td v-if="systems[id]" valign="top">
              <table-entity
                :img="systems[id].avatarUrl"
                :size="settings.iconSize + 'px'"
                :label="systems[id].getName(detectPronouns)"
                :caption="systems[id].getPronouns(detectPronouns)"
                :square="settings.squareIcons"
                :show-icon="settings.showIcons"
                @click="dialog.show({ system: systems[id] })"
              />
            </td>
            <td v-else valign="middle">
              <q-spinner-dots size="24px" />
            </td>
            <template v-if="fronters[id]">
              <template v-if="fronters[id].allowed">
                <td v-if="useMobileUi" valign="top" style="padding-bottom: 0">
                  <table-entity
                    v-for="member of fronters[id].members"
                    :key="member.id"
                    :img="member.avatarUrl"
                    :size="settings.iconSize + 'px'"
                    :label="member.getName(detectPronouns)"
                    :caption="member.getPronouns(detectPronouns)"
                    class="q-mb-sm"
                    :square="settings.squareIcons"
                    :show-icon="settings.showIcons"
                    @click="dialog.show({ member, system: systems[id] })"
                  />
                </td>
                <template v-else>
                  <td
                    v-for="member of fronters[id].members"
                    :key="member.id"
                    valign="top"
                    style="width: 1%"
                  >
                    <table-entity
                      :img="member.avatarUrl"
                      :size="settings.iconSize + 'px'"
                      :label="member.getName(detectPronouns)"
                      :caption="member.getPronouns(detectPronouns)"
                      :square="settings.squareIcons"
                      :show-icon="settings.showIcons"
                      @click="dialog.show({ member, system: systems[id] })"
                    />
                  </td>
                  <td
                    v-if="maxFront - (fronters[id].members.length || 0) > 0"
                    :colspan="maxFront - (fronters[id].members.length || 0)"
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
              <q-spinner-dots size="24px" />
            </td>
            <!-- Spacer -->
            <td v-if="!useMobileUi" />
            <!-- Last Switch/Updated -->
            <template v-if="useMobileUi">
              <td
                v-if="settings.showLastSwitch || settings.showUpdateTime"
                valign="top"
              >
                <q-item
                  dense
                  class="q-pa-none"
                  :style="`min-height: ${settings.iconSize}px`"
                >
                  <q-item-section class="col-auto">
                    <q-item-label v-if="settings.showLastSwitch">
                      <relative-time-display
                        v-if="fronters[id]"
                        :time="fronters[id]?.lastSwitch"
                      />
                    </q-item-label>
                    <q-item-label
                      v-if="settings.showUpdateTime"
                      :caption="settings.showLastSwitch"
                    >
                      <relative-time-display
                        v-if="fronters[id]"
                        :time="fronters[id]?.lastUpdated"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </td>
            </template>
            <template v-else>
              <td v-if="settings.showLastSwitch" valign="top">
                <relative-time-display
                  v-if="fronters[id]"
                  :time="fronters[id]?.lastSwitch"
                />
              </td>
              <td v-if="settings.showUpdateTime" valign="top">
                <relative-time-display
                  v-if="fronters[id]"
                  :time="fronters[id]?.lastUpdated"
                />
              </td>
            </template>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>

  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { Fronters } from 'src/models/Fronters';
import { useSettingsStore } from 'src/stores/settings-store';
import { System } from 'src/models/System';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import TableEntity from 'src/pages/status/Table/TableEntity.vue';
import { useServices } from 'src/lib/Services';

const $q = useQuasar();

const settingsStore = useSettingsStore();
const { detectPronouns } = storeToRefs(settingsStore);
const settings = settingsStore.status.table;
const { fronterCache } = useServices();

const useMobileUi = computed(() => $q.screen.lt.sm || settings.forceMobileUi);
const dialog = ref();

export interface Props {
  ids: Array<string>;
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

const props = defineProps<Props>();

const maxFront = computed(() =>
  Math.max(
    ...fronterCache.getMultiCached(props.ids).map((f) => f.members.length),
  ),
);

const rowLineHeight = computed(
  () =>
    'line-height: ' +
    (settings.showIcons && settings.iconSize > 34
      ? `${settings.iconSize}px`
      : '2.4em'),
);
const headerIconPaddingStyle = computed(() =>
  settings.showIcons ? `padding-left: ${24 + settings.iconSize}px` : '',
);
</script>
