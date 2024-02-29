<template>
  <q-card-section class="q-py-md">
    <div class="row items-center no-wrap">
      <div class="col-auto q-mr-sm">
        <q-icon :name="icon" size="24px" />
      </div>
      <div class="col text-subtitle1">{{ text }}</div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  text: string;
}>();
</script>
