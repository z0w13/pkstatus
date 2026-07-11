<template>
  <q-dialog v-model="visible">
    <system-card
      v-if="system && !member && !group"
      :system="system"
      :details="showCardDetails"
      :popup="true"
    />
    <member-card
      v-if="member && system"
      :member="member"
      :system="system"
      :details="showCardDetails"
      :popup="true"
    />
    <group-card
      v-if="group && system"
      :group="group"
      :system="system"
      :details="showCardDetails"
      :popup="true"
    />
  </q-dialog>
</template>

<script setup lang="ts">
import { Member } from '@/models/Member';
import { System } from '@/models/System';
import { ref } from 'vue';

import GroupCard from '@/components/Card/GroupCard.vue';
import MemberCard from '@/components/Card/MemberCard.vue';
import SystemCard from '@/components/Card/SystemCard.vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings-store';
import { Group } from '@/models/Group';

const { showCardDetails } = storeToRefs(useSettingsStore());

const visible = ref(false);
const group = ref<Group | null>(null);
const member = ref<Member | null>(null);
const system = ref<System | null>(null);

function show(opts: { system?: System; member?: Member; group?: Group }) {
  group.value = opts.group ?? null;
  member.value = opts.member ?? null;
  system.value = opts.system ?? null;

  visible.value = true;
}

defineExpose({
  show,
});
</script>
