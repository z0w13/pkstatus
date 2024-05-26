<template>
  <q-card>
    <q-card-section class="row">
      <div class="col-auto self-center">
        <initial-fallback-avatar
          v-if="group.icon"
          size="64px"
          :url="group.icon"
          :name="group.getName()"
          @click="showAvatar = !!group.icon"
        />
      </div>
      <div :class="{ col: true, 'q-ml-md': !!group.icon, 'self-center': true }">
        <fitty style="line-height: 100%" :options="{ maxSize: 100 }">
          {{ group.getName() }}
        </fitty>
      </div>
    </q-card-section>
    <img v-if="group.banner" :src="group.banner" />
    <q-card-actions
      v-if="popup"
      class="bg-primary text-white"
      :style="
        lookup.colorAccent
          ? `min-height: 52px; background-color: #${group.color} !important;`
          : ''
      "
    >
      <q-btn
        v-if="!systemPage"
        color="dark"
        label="View System"
        :to="`/lookup/system/${system.id}`"
      />
      <q-btn
        color="dark"
        label="View Group"
        :to="`/lookup/group/${group.id}`"
      />
    </q-card-actions>
    <q-card-section v-if="details">
      <q-markup-table flat separator="horizontal" style="overflow: hidden">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ group.id }}</td>
          </tr>
          <tr>
            <td>System</td>
            <td>{{ system.getName(detectPronouns) }}</td>
          </tr>
          <tr>
            <td>Members</td>
            <td>{{ group.members.length }}</td>
          </tr>
          <tr v-if="group.color">
            <td>Color</td>
            <td
              :style="{
                color: `#${group.color}`,
                fontSize: '48px',
                lineHeight: '16px',
                textIndent: '-4px',
              }"
            >
              &bull;
            </td>
          </tr>
          <tr>
            <td>Created At</td>
            <td>{{ group.createdAt.format('YYYY-MM-DD') }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section v-if="!!group.description?.length">
      <pre class="description">{{ group.description }}</pre>
    </q-card-section>
    <avatar-dialog
      v-if="group.icon"
      v-model="showAvatar"
      :avatar-url="group.icon"
    />
  </q-card>
</template>

<script setup lang="ts">
import { Fitty } from '@lumenpink/vue3-fitty';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import AvatarDialog from 'src/components/Card/AvatarDialog.vue';

import { Group } from 'src/models/Group';
import { System } from 'src/models/System';

import { useSettingsStore } from 'src/stores/settings-store';
import { useRoute } from 'vue-router';

const settings = useSettingsStore();
const { detectPronouns, lookup } = storeToRefs(settings);
const showAvatar = ref(false);

withDefaults(
  defineProps<{
    group: Group;
    system: System;
    details?: boolean;
    popup?: boolean;
  }>(),
  { details: true, popup: false },
);

const systemPage = computed(() =>
  useRoute().name?.toString().startsWith('lookup-system'),
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
