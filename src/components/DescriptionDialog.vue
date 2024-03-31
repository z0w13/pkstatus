<template>
  <q-dialog v-model="visible">
    <system-card v-if="system" :system="system" />
    <member-card v-if="member" :member="member" />
  </q-dialog>
</template>

<script setup lang="ts">
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { ref } from 'vue';

import MemberCard from 'src/components/MemberCard.vue';
import SystemCard from 'src/components/SystemCard.vue';

const visible = ref(false);
const member = ref<Member | null>(null);
const system = ref<System | null>(null);

function show(opts: { system?: System; member?: Member }) {
  member.value = opts.member || null;
  system.value = opts.system || null;

  visible.value = true;
}

defineExpose({
  show,
});
</script>
