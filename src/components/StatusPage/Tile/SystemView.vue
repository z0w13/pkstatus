<template>
  <div class="col-auto" v-if="system">
    <q-card flat :style="{ width: `${cardWidth}px` }">
      <labeled-tile
        :img="system.avatarUrl"
        :label="system.getName(detectPronouns)"
        :caption="system.getPronouns(detectPronouns)"
        :size="`${cardWidth}px`"
        :fallback-icon="matGroups"
      >
        <q-card-section
          v-if="fronters && showStats"
          :class="{ 'q-px-none': cardWidth < 220 }"
        >
          <q-item v-if="showUpdateTime">
            <q-item-section avatar v-if="cardWidth > 180">
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
            <q-item-section avatar v-if="cardWidth > 180">
              <q-icon name="swap_horiz" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Last switch </q-item-label>
              <q-item-label caption>
                <relative-time-display :time="fronters.lastSwitch" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-separator v-if="showDescription && showStats" />

        <q-card-section v-if="showDescription">
          <pre class="description">{{ system.description }}</pre>
        </q-card-section>
      </labeled-tile>
    </q-card>
  </div>
  <div class="col-auto" v-else>
    <q-card
      flat
      class="justify-center row"
      :style="{ width: `${cardWidth}px`, height: `${cardWidth}px` }"
    >
      <q-spinner class="self-center" color="primary" width="50%" height="50%" />
    </q-card>
  </div>
  <div class="col">
    <div class="row q-col-gutter-md">
      <template v-if="fronters">
        <template v-if="fronters.allowed">
          <div
            class="col-auto"
            :key="fronter.id"
            v-for="fronter of fronters.members"
          >
            <labeled-tile
              :img="fronter.avatarUrl"
              :label="fronter.getName(detectPronouns)"
              :caption="fronter.getPronouns(detectPronouns)"
              :size="`${cardWidth}px`"
            >
              <q-card-section
                v-if="fronter.description && showFronterDescription"
              >
                <pre class="description">{{ fronter.description }}</pre>
              </q-card-section>
            </labeled-tile>
          </div>
        </template>
        <div v-else class="col-auto">
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
      <div v-else class="row">
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
import { Fronters } from 'src/models/Fronters';
import { System } from 'src/models/System';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';
import LabeledTile from 'src/components/StatusPage/Tile/LabeledTile.vue';
import { computed } from 'vue';
import { matGroups } from '@quasar/extras/material-icons';

export interface Props {
  system?: System;
  fronters?: Fronters;

  detectPronouns: boolean;
  showLastSwitch: boolean;
  showUpdateTime: boolean;
  showSystemDescription: boolean;
  showFronterDescription: boolean;
  cardWidth: number;
}

const props = defineProps<Props>();
const showStats = computed(() => props.showLastSwitch || props.showUpdateTime);
const showDescription = computed(
  () => props.showSystemDescription && props.system?.description,
);
</script>
