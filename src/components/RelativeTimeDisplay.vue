<template>
  {{ fromNow }}
</template>

<script setup lang="ts">
import { onUnmounted, onMounted, ref } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const props = defineProps<{ time: dayjs.Dayjs | null | undefined }>();
const fromNow = ref();

function updateFromNow() {
  fromNow.value = props.time ? props.time.fromNow() : 'unknown';
}

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  updateFromNow();
  updateInterval = setInterval(updateFromNow, 1000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
