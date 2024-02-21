<template>
  <component :is="props.tag">
    Last updated {{ secondsAgo }} seconds ago
  </component>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, withDefaults } from 'vue';

export interface Props {
  tag?: string;
  time: number;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'i',
});

const secondsAgo = ref(0);

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  updateInterval = setInterval(() => {
    secondsAgo.value = Math.floor((Date.now() - props.time) / 1000);
  }, 500);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
