<template>
  <q-item
    v-for="member of members"
    :key="member.id"
    clickable
    :class="{ 'member-accent': true, 'bg-lighten': !$q.dark.isActive }"
    :style="
      (member.color ? `border-left-color: #${member.color};` : '') +
      ($q.dark.isActive ? 'background-color: var(--q-dark);' : '')
    "
    @click="emit('memberClick', member)"
  >
    <q-item-section avatar>
      <initial-fallback-avatar
        :name="member.getName(detectPronouns)"
        :url="member.avatarUrl"
      />
    </q-item-section>
    <q-item-section no-wrap>
      <q-item-label>
        {{ member.getName(detectPronouns) }}
      </q-item-label>
      <q-item-label v-if="member.getPronouns(detectPronouns)" caption>
        {{ member.getPronouns(detectPronouns) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

const emit = defineEmits<{
  (e: 'memberClick', member: Member): void;
}>();

defineProps<{
  system: System;
  members: Array<Member>;
  detectPronouns: boolean;
}>();
</script>
