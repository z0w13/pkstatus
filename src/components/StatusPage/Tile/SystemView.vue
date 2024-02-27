<template>
  <div class="col-auto">
    <q-card flat :style="{ width: `${cardWidth}px` }">
      <q-img ratio="1" :src="system.avatarUrl" v-if="system.avatarUrl">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ system.name }}
        </div>
      </q-img>
      <div v-else class="absolute-bottom text-subtitle2 text-center">
        {{ system.name }}
      </div>

      <q-card-section v-if="fronters && showStats">
        <q-item v-if="showUpdateTime">
          <q-item-section avatar>
            <q-icon name="update" />
          </q-item-section>
          <q-item-section>
            <q-item-label> Last updated </q-item-label>
            <q-item-label caption>
              <relative-time-display :time="fronters.lastUpdated" />
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="showLastSwitch">
          <q-item-section avatar>
            <q-icon name="swap_horiz" />
          </q-item-section>
          <q-item-section>
            <q-item-label> Last switch </q-item-label>
            <q-item-label caption>
              <relative-time-display
                v-if="!!fronters.lastSwitch"
                :time="fronters.lastSwitch"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator v-if="showDescription && showStats" />

      <q-card-section v-if="showDescription">
        <span v-html="system.description.replaceAll('\n', '<br />')" />
      </q-card-section>
    </q-card>
  </div>
  <div class="col">
    <div class="row q-col-gutter-md">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Fronters } from 'stores/fronters-store';
import { System } from 'src/models/System';
import AlterView from 'src/components/StatusPage/Tile/AlterView.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import { computed } from 'vue';

export interface Props {
  system: System;
  fronters?: Fronters;

  showLastSwitch: boolean;
  showUpdateTime: boolean;
  showSystemDescription: boolean;
  showFronterDescription: boolean;
  cardWidth: number;
}

const props = defineProps<Props>();
const showDescription = computed(
  () => props.showSystemDescription && props.system.description.length > 0,
);
const showStats = computed(() => props.showLastSwitch || props.showUpdateTime);
</script>
