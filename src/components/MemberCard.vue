<template>
  <q-card>
    <q-card-section class="row">
      <div class="col-auto self-center">
        <initial-fallback-avatar
          v-if="member.avatarUrl"
          size="64px"
          :url="member.avatarUrl"
          :name="member.getName(detectPronouns)"
        />
      </div>
      <div class="col q-ml-md self-center">
        <fitty style="line-height: 100%" :options="{ maxSize: 100 }">
          {{ member.getName(detectPronouns) }}
        </fitty>
      </div>
    </q-card-section>
    <img :src="member.bannerUrl" v-if="member.bannerUrl" width="100%" />
    <q-card-section v-if="details">
      <q-markup-table flat separator="horizontal" style="overflow: hidden">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ member.id }}</td>
          </tr>
          <tr v-if="member.getPronouns(detectPronouns)">
            <td>Pronouns</td>
            <td>{{ member.getPronouns(detectPronouns) }}</td>
          </tr>
          <tr>
            <td>System</td>
            <td>{{ system.getName(detectPronouns) }}</td>
          </tr>
          <tr v-if="member.messageCount">
            <td>Messages Sent</td>
            <td>{{ member.messageCount.toLocaleString() }}</td>
          </tr>
          <tr v-if="member.lastMessageAt">
            <td>Last Message</td>
            <td><relative-time-display :time="member.lastMessageAt" /></td>
          </tr>
          <tr v-if="member.birthday">
            <td>Birthday</td>
            <td>{{ member.birthday.format('YYYY-MM-DD') }}</td>
          </tr>
          <tr v-if="member.color">
            <td>Color</td>
            <td
              :style="{
                color: `#${member.color}`,
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
            <td>{{ member.createdAt.format('YYYY-MM-DD') }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-card-section v-if="!!member.description?.length">
      <pre class="description">{{ member.description }}</pre>
    </q-card-section>
    <q-card-section class="row" v-if="system">
      <q-btn
        label="Go To System"
        color="primary"
        :to="`/lookup/system/${system.id}`"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { Fitty } from '@lumenpink/vue3-fitty';
import { storeToRefs } from 'pinia';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';

const settings = useSettingsStore();
const { detectPronouns } = storeToRefs(settings);

withDefaults(
  defineProps<{
    member: Member;
    system: System;
    details: boolean;
    popup: boolean;
  }>(),
  { details: true, popup: false },
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
