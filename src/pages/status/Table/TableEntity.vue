<template>
  <q-item dense class="q-pa-none">
    <q-item-section avatar class="col-auto q-pr-sm">
      <initial-fallback-avatar
        v-if="!icon"
        :name="text"
        :url="img"
        :size="size"
        :square="square"
        :color="color"
      />
      <q-avatar
        v-else
        :color="color"
        :icon="icon"
        :size="size"
        :square="square"
      />
    </q-item-section>
    <q-item-section class="col-auto">
      {{ text }}

      <q-tooltip v-if="tooltip">
        <pre class="description">{{ tooltip }}</pre>
      </q-tooltip>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

withDefaults(
  defineProps<{
    tooltip?: string | null;
    text: string;
    icon?: string | null;
    color?: string;
    img?: string | null;
    size: string;
    square: boolean;
  }>(),
  {
    color: 'primary',
  },
);
</script>
