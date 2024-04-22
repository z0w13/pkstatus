<template>
  <q-card :style="popup ? 'min-width: 400px' : ''">
    <q-card-section class="row">
      <div class="col-auto self-center">
        <initial-fallback-avatar
          v-if="system.avatarUrl"
          size="64px"
          :url="system.avatarUrl"
          :name="system.getName(detectPronouns)"
          @click="showAvatar = !!system.avatarUrl"
        />
      </div>
      <div class="col q-ml-md self-center">
        <fitty style="line-height: 100%" :options="{ maxSize: 100 }">
          {{ system.getName(detectPronouns) }}
        </fitty>
      </div>
    </q-card-section>
    <img v-if="system.bannerUrl" :src="system.bannerUrl" />
    <q-card-actions
      v-if="popup"
      class="bg-primary text-white"
      :style="
        lookup.colorAccent
          ? `min-height: 52px; background-color: #${system.color} !important;`
          : ''
      "
    >
      <q-btn
        color="dark"
        label="View Full System"
        :to="`/lookup/system/${system.id}`"
      />
    </q-card-actions>
    <q-card-section v-if="details" class="q-pt-none">
      <q-markup-table flat separator="horizontal" style="overflow: hidden">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ system.id }}</td>
          </tr>
          <tr>
            <td>Created At</td>
            <td>{{ system.createdAt.format('YYYY-MM-DD') }}</td>
          </tr>
          <tr>
            <td>Tag</td>
            <td>{{ system.tag }}</td>
          </tr>
          <tr v-if="system.getPronouns(detectPronouns)">
            <td>Pronouns</td>
            <td>{{ system.getPronouns(detectPronouns) }}</td>
          </tr>
          <tr v-if="system.color">
            <td>Color</td>
            <td
              :style="{
                color: `#${system.color}`,
                fontSize: '48px',
                lineHeight: '16px',
                textIndent: '-4px',
              }"
            >
              &bull;
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="system.description.length > 0">
      <pre class="description">{{ system.description }}</pre>
    </q-card-section>
    <avatar-dialog v-model="showAvatar" :avatar-url="system.avatarUrl!" />
  </q-card>
</template>

<script setup lang="ts">
import { Fitty } from '@lumenpink/vue3-fitty';
import { storeToRefs } from 'pinia';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';
import { ref } from 'vue';
import AvatarDialog from './AvatarDialog.vue';

const settings = useSettingsStore();
const { detectPronouns, lookup } = storeToRefs(settings);
const showAvatar = ref(false);

withDefaults(
  defineProps<{ system: System; details?: boolean; popup?: boolean }>(),
  {
    details: true,
    popup: false,
  },
);
</script>

<style scoped lang="css">
td:first-child {
  padding-left: 0 !important;
}
td:last-child {
  padding-right: 0 !important;
}
</style>
