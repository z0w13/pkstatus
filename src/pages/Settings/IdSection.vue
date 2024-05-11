<template>
  <q-item-label header>ID Settings</q-item-label>
  <q-item tag="label">
    <q-item-section>
      <q-item-label>Capitalize IDs</q-item-label>
      <q-item-label caption>
        Whether to display IDs as capital letters, to ease readability
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-toggle v-model="id.caps" />
    </q-item-section>
  </q-item>
  <q-item tag="label">
    <q-item-section>
      <q-item-label>Split IDs</q-item-label>
      <q-item-label caption>
        Whether to display 6-character IDs split with a hyphen, to ease
        readability
      </q-item-label>
    </q-item-section>
    <q-item-section avatar>
      <q-toggle v-model="id.sep" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore();
const { id } = storeToRefs(settings);
</script>
