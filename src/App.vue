<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useSettingsStore } from './stores/settings-store';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';

const $q = useQuasar();
const settings = useSettingsStore();
const { dark } = storeToRefs(settings);

// Watch for changes to dark mode and update the UI
watch(dark, (newVal) => $q.dark.set(newVal), {
  immediate: true,
});
</script>
