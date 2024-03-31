<template>
  <q-avatar :size="size" :color="bgColor" class="text-white">
    <q-img :ratio="1" v-if="url" :src="url" @load="onLoad" @error="onError">
      <template v-slot:error>
        <q-icon
          :size="size"
          :style="{
            transform: 'translate(-50%, -50%) scale(60%)',
            width: size,
            height: size,
          }"
          class="absolute-center"
          color="white"
          :name="matBrokenImage"
        />
      </template>
    </q-img>
    <template v-else>
      {{ name.substring(0, 1) }}
    </template>
  </q-avatar>
</template>

<script setup lang="ts">
import { matBrokenImage } from '@quasar/extras/material-icons';
import { toRef } from 'vue';

const props = withDefaults(
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

const bgColor = toRef(props.color);

function onLoad() {
  bgColor.value = '';
}
function onError() {
  bgColor.value = 'grey';
}
</script>
