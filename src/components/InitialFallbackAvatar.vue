<template>
  <q-avatar :size="size" :color="url ? '' : color">
    <q-img :ratio="1" v-if="url" :src="url">
      <template v-slot:error>
        <q-icon class="bg-grey" color="white" name="broken_image" />
      </template>
    </q-img>
    <template v-else>
      {{ name.substring(0, 1) }}
    </template>
  </q-avatar>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    url?: string | null;
    color?: string;
    name: string;
    size?: string;
  }>(),
  {
    color: 'primary',
  },
);
</script>
