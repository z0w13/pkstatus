<template>
  <template v-if="group && system">
    <group-card :group="group" :system="system" flat />
    <member-view :system="system" :members="members" :dialog="dialog" />
  </template>
  <q-linear-progress v-else-if="status == 'loading'" indeterminate />
  <div
    v-else-if="status == 'forbidden'"
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
  >
    Not Allowed To View Group
  </div>
  <div
    v-else-if="status == 'notfound'"
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
  >
    Group Not Found
  </div>
  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { APIError } from 'pkapi.js';

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';
import { Group } from 'src/models/Group';

import { useServices } from 'src/lib/Services';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import GroupCard from 'src/components/Card/GroupCard.vue';
import MemberView from 'src/pages/Lookup/System/View/MemberView.vue';

const route = useRoute();

const { pluralKit } = useServices();

const status = ref<'loading' | 'forbidden' | 'notfound'>('loading');
const group = ref<Group | null>(null);
const system = ref<System | null>(null);
const members = ref<{
  loading: boolean;
  allowed: boolean;
  list: Array<Member>;
}>({
  loading: true,
  allowed: true,
  list: [],
});

const dialog = ref();

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId || Array.isArray(newId)) {
      return;
    }

    group.value = null;

    try {
      group.value = await pluralKit.getGroup(newId);
      system.value = await pluralKit.getSystem(group.value.system);
    } catch (e) {
      if (e instanceof APIError) {
        if (e.status == '404') {
          // Not Found
          status.value = 'notfound';
        } else if (e.status == '403') {
          // Forbidden
          status.value = 'forbidden';
        } else {
          throw e; // Rethrow if we shouldn't handle the error
        }
      } else {
        throw e; // Rethrow if we shouldn't handle the error
      }
    }

    try {
      members.value.list = await pluralKit.getGroupMembers(newId);
    } catch (e) {
      if (e instanceof APIError && e.status == '403') {
        // Forbidden
        members.value.allowed = false;
      } else {
        throw e; // Rethrow if we shouldn't handle the error
      }
    }
    members.value.loading = false;
  },
  { immediate: true },
);
</script>
