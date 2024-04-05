<template>
  <template v-if="member && system">
    <member-card :member="member" :system="system" flat />
  </template>
  <q-linear-progress indeterminate v-else-if="status == 'loading'" />
  <div
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
    v-else-if="status == 'forbidden'"
  >
    Not Allowed To View Member
  </div>
  <div
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
    v-else-if="status == 'notfound'"
  >
    Member Not Found
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { pk } from 'src/boot/pkapi';

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';
import { getSystem } from 'src/stores/system-store';

import MemberCard from 'src/components/MemberCard.vue';
import { APIError } from 'pkapi.js';

const route = useRoute();

const status = ref<'loading' | 'forbidden' | 'notfound'>('loading');
const member = ref<Member | null>(null);
const system = ref<System | null>(null);

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId || Array.isArray(newId)) {
      return;
    }

    member.value = null;

    try {
      const pkMember = await pk.getMember({
        member: newId,
      });
      member.value = Member.fromPKApi(pkMember);
      system.value = await getSystem(pkMember.system);
    } catch (e) {
      if (e instanceof APIError) {
        if (e.status == '404') {
          // Not Found
          status.value = 'notfound';
        } else if (e.status == '403') {
          // Forbidden
          status.value = 'forbidden';
        }
      }
    }
  },
  { immediate: true },
);
</script>
