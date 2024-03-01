<template>
  <div class="row justify-center" style="min-height: inherit">
    <div class="col-auto q-mt-lg">
      <q-list>
        <template :key="id" v-for="[id, system] in Object.entries(systems)">
          <q-item>
            <q-item-section avatar>
              <initial-fallback-avatar
                :name="system.name"
                :url="system.avatarUrl"
                :size="settings.iconSize + 'px'"
                :square="settings.squareIcons"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ system.name }}
                <q-icon name="info" v-if="system.description">
                  <q-tooltip>
                    <pre class="description">{{ system.description }}</pre>
                  </q-tooltip>
                </q-icon>
              </q-item-label>
              <q-item-label v-if="system.getPronouns()" caption>
                {{ system.getPronouns() }}
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
          <template v-if="fronters[id]">
            <template v-if="fronters[id].allowed">
              <q-item
                :key="fronter.id"
                v-for="fronter of fronters[id].members"
                :inset-level="1"
              >
                <q-item-section avatar>
                  <initial-fallback-avatar
                    :name="fronter.getName()"
                    :url="fronter.avatarUrl"
                    :size="settings.iconSize + 'px'"
                    :square="settings.squareIcons"
                  />
                </q-item-section>
                <q-item-section no-wrap>
                  <q-item-label>
                    {{ fronter.getName({ stripPronouns: true }) }}
                    <q-icon name="info" v-if="fronter.description">
                      <q-tooltip>
                        <pre class="description">{{ fronter.description }}</pre>
                      </q-tooltip>
                    </q-icon>
                  </q-item-label>
                  <q-item-label caption>
                    {{ fronter.getPronouns() }}
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
</template>

<script setup lang="ts">
import { Fronters } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { System } from 'src/models/System';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

const settings = useSettingsStore().status.list;

export interface Props {
  fronters: Record<string, Fronters>;
  systems: Record<string, System>;
}

defineProps<Props>();
</script>
