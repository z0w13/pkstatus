<template>
  <q-card flat :style="{ width: size }">
    <q-img v-if="img" ratio="1" :src="img">
      <div
        class="absolute-bottom text-center"
        :style="!!caption ? 'padding-top: 6px; padding-bottom: 6px' : ''"
      >
        <div class="text-subtitle2">{{ label }}</div>
        <div v-if="caption" class="text-caption">{{ caption }}</div>
      </div>
      <template #error>
        <q-icon
          :size="size"
          :style="{
            width: size,
            height: size,
          }"
          class="absolute-center"
          color="grey"
          :name="matBrokenImage"
        />
        <div
          class="absolute-bottom text-center"
          :style="!!caption ? 'padding-top: 6px; padding-bottom: 6px' : ''"
        >
          <div class="text-subtitle2">{{ label }}</div>
          <div v-if="caption" class="text-caption">{{ caption }}</div>
        </div>
      </template>
    </q-img>
    <q-img v-else ratio="1">
      <q-icon
        :size="size"
        :style="{
          transform: 'translate(-50%, -50%) scale(75%)',
          width: size,
          height: size,
        }"
        class="absolute-center"
        color="grey"
        :name="fallbackIcon"
      />
      <div
        class="absolute-bottom text-center"
        :style="!!caption ? 'padding-top: 6px; padding-bottom: 6px' : ''"
      >
        <div class="text-subtitle2">{{ label }}</div>
        <div v-if="caption" class="text-caption">{{ caption }}</div>
      </div>
    </q-img>

    <slot />
  </q-card>
</template>

<script setup lang="ts">
import { matPerson, matBrokenImage } from '@quasar/extras/material-icons';

withDefaults(
  defineProps<{
    img: string | null;
    label: string;
    caption?: string | null;
    size: string;
    fallbackIcon?: string;
  }>(),
  {
    img: null,
    caption: null,
    fallbackIcon: matPerson,
  },
);
</script>
