<template>
  <q-btn-dropdown icon="settings" flat>
    <q-list bordered class="rounded-borders">
      <q-item>
        <q-item-section>
          <q-item-label overline class="q-mb-xs"
            >Vertical Position</q-item-label
          >
          <q-btn-toggle
            v-model="settings.verticalPosition"
            color="grey-9"
            :options="[
              { label: 'Top', value: 'start' },
              { label: 'Middle', value: 'center' },
              { label: 'Bottom', value: 'end' },
            ]"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="q-mb-xs"
            >Horizontal Position</q-item-label
          >
          <q-btn-toggle
            v-model="settings.horizontalPosition"
            color="grey-9"
            :options="[
              { label: 'Left', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'end' },
            ]"
          />
        </q-item-section>
      </q-item>
      <q-separator class="q-mt-sm" />
      <q-item>
        <q-item-section>
          <q-item-label>Show Icons</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.showIcons" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Square Icons</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.squareIcons" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label>Force Mobile UI</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.forceMobileUi" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Show Update Time</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.showUpdateTime" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Show Last Switch</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.showLastSwitch" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label>Icon Size</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="settings.iconSize"
            :min="24"
            :max="128"
            label
            :label-value="settings.iconSize + 'px'"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore().status.table;
</script>
