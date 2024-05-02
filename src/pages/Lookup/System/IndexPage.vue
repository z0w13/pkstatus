<template>
  <template v-if="system">
    <system-card :system="system" flat />
    <router-view
      :dialog="dialog"
      :system="system"
      :fronters="fronters"
      :members="members"
    />
    <q-footer>
      <q-toolbar>
        <q-tabs align="center" class="bg-primary full-width">
          <q-route-tab
            :to="{
              name: 'lookup-system-fronters',
              params: { id: route.params.id },
            }"
            color="primary"
            icon="person_search"
            label="Fronters"
          />
          <q-route-tab
            :to="{
              name: 'lookup-system-members',
              params: { id: route.params.id },
            }"
            color="primary"
            icon="people"
            label="Members"
          />
        </q-tabs>
      </q-toolbar>
    </q-footer>
  </template>
  <q-linear-progress v-else-if="status == 'loading'" indeterminate />
  <div
    v-else-if="status == 'forbidden'"
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
  >
    <q-icon name="cross" />
    Not Allowed To View System
  </div>
  <div v-else-if="status == 'notfound'" class="row q-mt-lg q-pa-md bg-lighten">
    <q-icon name="error" />
    System Not Found
  </div>
  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { APIError } from 'pkapi.js';

import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';
import { useSettingsStore } from 'src/stores/settings-store';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import SystemCard from 'src/components/Card/SystemCard.vue';

import { getNameSort } from 'src/util';
import { useServices } from 'src/lib/Services';

const route = useRoute();
const settingsStore = useSettingsStore();
const { pluralKit } = useServices();
const { detectPronouns } = storeToRefs(settingsStore);

const status = ref<'loading' | 'forbidden' | 'notfound'>('loading');
const system = ref<System | null>(null);
const fronters = ref<Fronters | null>(null);
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

    system.value = null;
    fronters.value = null;
    members.value.loading = true;
    members.value.list = [];

    try {
      system.value = await pluralKit.getSystem(newId);
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
      return;
    }

    fronters.value = await pluralKit.getFronters(newId);

    try {
      members.value.list = (await pluralKit.getMembers(newId)).sort(
        getNameSort(detectPronouns.value),
      );

      members.value.loading = false;
      members.value.allowed = true;
    } catch (e) {
      if (e instanceof APIError && e.status == '403') {
        members.value = {
          loading: false,
          allowed: false,
          list: [],
        };
      } else {
        throw e;
      }
    }
  },
  { immediate: true },
);
</script>
