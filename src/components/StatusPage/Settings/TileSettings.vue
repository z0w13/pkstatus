<template>
  <q-btn-dropdown icon="settings" flat>
    <q-list bordered class="rounded-borders">
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
          <q-item-label>Show System Descriptionn</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.showSystemDescription" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Show Fronter Descriptionn</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle v-model="settings.showFronterDescription" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label>Panel Width</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="settings.tileSize"
            :min="100"
            :max="500"
            label
            :label-value="settings.tileSize + 'px'"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore().status.tile;
</script>
