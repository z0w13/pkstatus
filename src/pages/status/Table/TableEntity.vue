<template>
  <div>
    <q-item dense class="q-pa-none">
      <q-item-section v-if="showIcon" avatar class="col-auto q-pr-sm">
        <initial-fallback-avatar
          v-if="!icon"
          :name="label"
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
        <q-item-label>
          {{ label }}
        </q-item-label>
        <q-item-label v-if="caption" caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

withDefaults(
  defineProps<{
    showIcon?: boolean;
    tooltip?: string | null;
    label: string;
    caption?: string | null;
    icon?: string | null;
    color?: string;
    img?: string | null;
    size: string;
    square?: boolean;
  }>(),
  {
    showIcon: true,
    tooltip: null,
    caption: null,
    icon: null,
    color: 'primary',
    img: null,
    square: false,
  },
);
</script>
