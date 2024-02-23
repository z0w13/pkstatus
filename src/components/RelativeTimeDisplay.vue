<template>
  {{ dayjs(time).fromNow() }}
</template>

<script setup lang="ts">
import { onUnmounted, onMounted, getCurrentInstance } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export interface Props {
  time: number;
}

defineProps<Props>();

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  updateInterval = setInterval(() => {
    getCurrentInstance()?.proxy?.$forceUpdate();
  }, 1000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
