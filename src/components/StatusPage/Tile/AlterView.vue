<template>
  <div class="col-auto">
    <q-card flat :style="{ width: `${cardWidth}px` }">
      <q-img ratio="1" :src="fronter.avatar_url">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ fronter.display_name || fronter.name }}
        </div>
      </q-img>

      <q-card-section v-if="showFronterDescription">
        <span v-html="fronter?.description?.replaceAll('\n', '<br />')" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Member } from 'pkapi.js';

export interface Props {
  fronter: Member;

  showFronterDescription: boolean;
  cardWidth: number;
}

defineProps<Props>();
</script>
