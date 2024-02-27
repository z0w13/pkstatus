<template>
  <div class="col-auto">
    <q-list>
      <template :key="id" v-for="[id, system] in Object.entries(systems)">
        <q-item>
          <q-item-section avatar>
            <q-avatar
              :size="settings.iconSize + 'px'"
              v-if="system.avatarUrl"
              color="grey-10"
              square
            >
              <img :src="system.avatarUrl" />
            </q-avatar>
            <q-avatar
              :size="settings.iconSize + 'px'"
              v-else
              color="primary"
              icon="people"
              square
            />
          </q-item-section>
          <q-item-section>
            {{ system.name }}
          </q-item-section>
          <q-tooltip v-if="system.description">
            <pre class="description">{{ system.description }}</pre>
          </q-tooltip>
        </q-item>
        <template v-if="fronters[id]">
          <template v-if="fronters[id].allowed">
            <q-item
              :key="fronter.id"
              v-for="fronter of fronters[id].members"
              :inset-level="1"
            >
              <q-item-section avatar>
                <q-avatar
                  color="grey-10"
                  v-if="fronter.avatarUrl"
                  square
                  :size="settings.iconSize + 'px'"
                >
                  <q-img :ratio="1" :src="fronter.avatarUrl">
                    <template v-slot:error>
                      <q-icon
                        :size="`${settings.iconSize}px`"
                        class="bg-grey"
                        color="white"
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
              </q-item-section>
              <q-item-section>
                {{ fronter.displayName || fronter.name }}
              </q-item-section>
              <q-tooltip v-if="fronter.description">
                <pre class="description">{{ fronter.description }}</pre>
              </q-tooltip>
            </q-item>
          </template>
          <!-- No Access -->
          <q-item v-else :inset-level="1">
            <q-item-section avatar>
              <q-avatar
                color="red"
                icon="close"
                square
                :size="settings.iconSize + 'px'"
              />
            </q-item-section>
            <q-item-section>No Access</q-item-section>
          </q-item>
          <q-item v-if="settings.showUpdateTime" :inset-level="1">
            <q-item-section class="text-italic text-no-wrap">
              Last updated
              <relative-time-display :time="fronters[id].lastUpdated" />
            </q-item-section>
          </q-item>
          <q-item v-if="settings.showLastSwitch" :inset-level="1">
            <q-item-section class="text-italic text-no-wrap">
              Last switch
              <relative-time-display :time="fronters[id].lastSwitch" />
            </q-item-section>
          </q-item>
        </template>
        <!-- Loading -->
        <q-item v-else>
          <q-item-section>
            <q-linear-progress query />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { Fronters } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { System } from 'src/models/System';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const settings = useSettingsStore().status.list;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
