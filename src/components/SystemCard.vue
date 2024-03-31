<template>
  <q-card>
    <q-card-section class="row">
      <div class="col-auto self-center">
        <initial-fallback-avatar
          v-if="system.avatarUrl"
          size="64px"
          :url="system.avatarUrl"
          :name="system.getName(detectPronouns)"
        />
      </div>
      <div class="col q-ml-md self-center">
        <fitty style="line-height: 100%" :options="{ maxSize: 100 }">
          {{ system.getName(detectPronouns) }}
        </fitty>
      </div>
    </q-card-section>
    <img
      :src="system.bannerUrl"
      v-if="system.bannerUrl"
      style="max-width: 540px"
    />
    <q-card-section v-if="details">
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
          <tr v-if="system.pronouns">
            <td>Pronouns</td>
            <td>{{ system.pronouns }}</td>
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
  </q-card>
</template>

<script setup lang="ts">
import { Fitty } from '@lumenpink/vue3-fitty';
import { storeToRefs } from 'pinia';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore();
const { detectPronouns } = storeToRefs(settings);

withDefaults(defineProps<{ system: System; details: boolean }>(), {
  details: true,
});
</script>

<style scoped lang="css">
td:first-child {
  padding-left: 0 !important;
}
td:last-child {
  padding-right: 0 !important;
}
</style>
