<template>
  <template v-if="member && system">
    <member-card :member="member" :system="system" flat />
  </template>
  <q-linear-progress indeterminate v-else />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { pk } from 'src/boot/pkapi';

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';
import { getSystem } from 'src/stores/system-store';

import MemberCard from 'src/components/MemberCard.vue';

const route = useRoute();

const member = ref<Member | null>(null);
const system = ref<System | null>(null);

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId || Array.isArray(newId)) {
      return;
    }

    member.value = null;

    const pkMember = await pk.getMember({
      member: newId,
    });

    member.value = Member.fromPKApi(pkMember);
    system.value = await getSystem(pkMember.system);
  },
  { immediate: true },
);
</script>
