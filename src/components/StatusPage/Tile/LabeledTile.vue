<template>
  <q-card flat :style="{ width: `${size}px` }">
    <q-img v-if="img" ratio="1" :src="img">
      <div class="absolute-bottom text-subtitle2 text-center">
        {{ label }}
      </div>
      <template v-slot:error>
        <q-icon
          :size="`${size}px`"
          class="absolute-center"
          color="grey"
          name="broken_image"
        />
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ label }}
        </div>
      </template>
    </q-img>
    <q-img v-else ratio="1">
      <q-icon
        :size="`${size * 0.75}px`"
        class="absolute-center"
        color="grey"
        :name="fallbackIcon"
      />
      <div class="absolute-bottom text-subtitle2 text-center">
        {{ label }}
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
    size: number;
    fallbackIcon: string;
  }>(),
  {
    fallbackIcon: 'person',
  },
);
</script>
