<template>
  <q-card flat :style="{ width: size }">
    <q-img v-if="img" ratio="1" :src="img">
      <div class="absolute-bottom text-center">
        <div class="text-subtitle2">{{ label }}</div>
        <div class="text-caption" v-if="caption">{{ caption }}</div>
      </div>
      <template v-slot:error>
        <q-icon
          :size="size"
          class="absolute-center"
          color="grey"
          name="broken_image"
        />
        <div class="absolute-bottom text-center">
          <div class="text-subtitle1">{{ label }}</div>
          <div class="text-caption" v-if="caption">{{ caption }}</div>
        </div>
      </template>
    </q-img>
    <q-img v-else ratio="1">
      <q-icon
        :size="size"
        style="transform: translate(-50%, -50%) scale(75%)"
        class="absolute-center"
        color="grey"
        :name="fallbackIcon"
      />
      <div class="absolute-bottom text-center">
        <div class="text-subtitle1">{{ label }}</div>
        <div class="text-caption" v-if="caption">{{ caption }}</div>
      </div>
    </q-img>

    <slot />
  </q-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    img: string | null;
    label: string;
    caption?: string;
    size: string;
    fallbackIcon?: string;
  }>(),
  {
    fallbackIcon: 'person',
  },
);
</script>
