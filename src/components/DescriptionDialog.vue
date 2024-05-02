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
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { ref } from 'vue';

import GroupCard from 'src/components/Card/GroupCard.vue';
import MemberCard from 'src/components/Card/MemberCard.vue';
import SystemCard from 'src/components/Card/SystemCard.vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';
import { Group } from 'src/models/Group';

const { showCardDetails } = storeToRefs(useSettingsStore());

const visible = ref(false);
const group = ref<Group | null>(null);
const member = ref<Member | null>(null);
const system = ref<System | null>(null);

function show(opts: { system?: System; member?: Member; group?: Group }) {
  group.value = opts.group || null;
  member.value = opts.member || null;
  system.value = opts.system || null;

  visible.value = true;
}

defineExpose({
  show,
});
</script>
