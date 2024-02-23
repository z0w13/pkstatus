<template>
  <div class="col-auto">
    <q-card flat :style="{ width: `${cardWidth}px` }">
      <q-img ratio="1" :src="system.avatar_url">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ system.name }}
        </div>
      </q-img>

      <q-card-section v-if="showSystemDescription">
        <span v-html="system?.description?.replaceAll('\n', '<br />')" />
      </q-card-section>
    </q-card>
  </div>
  <template v-if="fronters">
    <template v-if="fronters.allowed">
      <alter-view
        :fronter="fronter"
        :key="fronter.id"
        :show-fronter-description="showFronterDescription"
        :card-width="cardWidth"
        v-for="fronter of fronters.members"
      />
    </template>
    <template v-else>
      <div class="col-auto">
        <q-card
          flat
          :style="{ width: `${cardWidth}px`, height: `${cardWidth}px` }"
        >
          <q-img ratio="1">
            <q-icon :size="cardWidth + 'px'" color="red" name="cancel" />
            <div class="absolute-bottom text-subtitle2 text-center">
              No Access
            </div>
          </q-img>
        </q-card>
      </div>
    </template>
  </template>
  <div v-else class="row justify-center">
    <div class="col-auto">
      <q-card
        flat
        class="justify-center row"
        :style="{ width: `${cardWidth}px`, height: `${cardWidth}px` }"
      >
        <q-spinner
          class="self-center"
          color="primary"
          width="50%"
          height="50%"
        />
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExtendedSystem } from 'stores/system-store';
import { Fronters } from 'stores/fronters-store';
import AlterView from 'src/components/StatusPage/Tile/AlterView.vue';

export interface Props {
  system: ExtendedSystem;
  fronters?: Fronters;

  showSystemDescription: boolean;
  showFronterDescription: boolean;
  cardWidth: number;
}

defineProps<Props>();
</script>
