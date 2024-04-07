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

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';

import MemberCard from 'src/components/Card/MemberCard.vue';
import { APIError } from 'pkapi.js';
import { useCacheStore } from 'src/stores/cache-store';

const route = useRoute();

const { pluralKit } = useCacheStore();

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
      member.value = await pluralKit.getMember(newId);
      system.value = await pluralKit.getSystem(member.value.system);
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
