<template>
  <div class="row justify-center" style="min-height: inherit">
    <div class="col-auto q-mt-lg">
      <q-list>
        <template :key="id" v-for="id of ids">
          <q-item
            v-if="systems[id]"
            clickable
            @click="dialog.show({ system: systems[id] })"
          >
            <q-item-section avatar>
              <initial-fallback-avatar
                :name="systems[id].getName(detectPronouns)"
                :url="systems[id].avatarUrl"
                :size="settings.iconSize + 'px'"
                :square="settings.squareIcons"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ systems[id].getName(detectPronouns) }}
              </q-item-label>
              <q-item-label
                v-if="systems[id].getPronouns(detectPronouns)"
                caption
              >
                {{ systems[id].getPronouns(detectPronouns) }}
              </q-item-label>
              <q-item-label
                caption
                v-if="fronters[id] && settings.showUpdateTime"
              >
                <q-icon class="q-mr-xs" name="update" aria-hidden="true" />
                <span class="sr-only">Last updated</span>
                <relative-time-display :time="fronters[id].lastUpdated" />
              </q-item-label>
              <q-item-label
                caption
                v-if="fronters[id] && settings.showLastSwitch"
              >
                <q-icon class="q-mr-xs" name="swap_horiz" aria-hidden="true" />
                <span class="sr-only">Last switch</span>
                <relative-time-display :time="fronters[id].lastSwitch" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section avatar>
              <q-spinner :size="settings.iconSize + 'px'" />
            </q-item-section>
            <q-item-section>Loading...</q-item-section>
          </q-item>
          <template v-if="fronters[id]">
            <template v-if="fronters[id].allowed">
              <q-item
                clickable
                @click="dialog.show({ member, system: systems[id] })"
                :key="member.id"
                v-for="member of fronters[id].members"
                :inset-level="1"
              >
                <q-item-section avatar>
                  <initial-fallback-avatar
                    :name="member.getName(detectPronouns)"
                    :url="member.avatarUrl"
                    :size="settings.iconSize + 'px'"
                    :square="settings.squareIcons"
                  />
                </q-item-section>
                <q-item-section no-wrap>
                  <q-item-label>
                    {{ member.getName(detectPronouns) }}
                  </q-item-label>
                  <q-item-label
                    caption
                    v-if="member.getPronouns(detectPronouns)"
                  >
                    {{ member.getPronouns(detectPronouns) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <!-- No Access -->
            <q-item v-else :inset-level="1">
              <q-item-section avatar>
                <q-avatar
                  :square="settings.squareIcons"
                  color="red"
                  icon="close"
                  :size="settings.iconSize + 'px'"
                />
              </q-item-section>
              <q-item-section>No Access</q-item-section>
            </q-item>
          </template>
          <!-- Loading -->
          <q-item v-else :inset-level="1">
            <q-item-section avatar>
              <q-spinner :size="settings.iconSize + 'px'" />
            </q-item-section>
            <q-item-section>Loading...</q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import DescriptionDialog from 'src/components/DescriptionDialog.vue';

import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';
import { useSettingsStore } from 'src/stores/settings-store';

const settingsStore = useSettingsStore();
const { detectPronouns } = storeToRefs(settingsStore);
const settings = settingsStore.status.list;

const dialog = ref();

export interface Props {
  ids: Array<string>;
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
