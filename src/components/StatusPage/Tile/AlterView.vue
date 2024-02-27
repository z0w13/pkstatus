<template>
  <div class="col-auto">
    <q-card flat :style="{ width: `${cardWidth}px` }">
      <q-img ratio="1" :src="fronter.avatarUrl || undefined">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ fronter.displayName || fronter.name }}
        </div>
      </q-img>

      <q-card-section v-if="showFronterDescription && fronter.description">
        <pre class="description">{{ fronter.description }}</pre>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Member } from 'src/models/Member';

export interface Props {
  fronter: Member;

  showFronterDescription: boolean;
  cardWidth: number;
}

const props = defineProps<Props>();
</script>
