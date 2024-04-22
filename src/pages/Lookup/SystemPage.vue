<template>
  <template v-if="system">
    <system-card :system="system" flat />
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>
          <div v-if="!fronters || fronters.allowed" class="row">
            <div class="col self-center">Fronters</div>
            <div class="col-auto">
              <q-btn-toggle
                v-model="lookup.memberLayout"
                dense
                flat
                :options="[
                  { value: 'list', icon: 'list' },
                  { value: 'table', icon: 'table_chart' },
                ]"
              />
            </div>
          </div>
          <div v-else>Fronter List Private</div>
        </q-item-label>

        <template v-if="fronters?.allowed">
          <member-list
            v-if="lookup.memberLayout == 'list'"
            :members="fronters.members"
            :system="system"
            :detect-pronouns="detectPronouns"
            @member-click="(member) => dialog.show({ system, member })"
          />
          <member-table
            v-else-if="lookup.memberLayout == 'table'"
            :members="fronters.members"
            :system="system"
            :detect-pronouns="detectPronouns"
            @member-click="(member) => dialog.show({ system, member })"
          />
        </template>
        <q-item v-else-if="!fronters">
          <q-linear-progress indeterminate />
        </q-item>
      </q-list>
    </div>
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>
          <div v-if="members.allowed" class="row">
            <div class="col self-center">Members</div>
            <div class="col-auto">
              <q-btn-toggle
                v-model="lookup.memberLayout"
                dense
                flat
                :options="[
                  { value: 'list', icon: 'list' },
                  { value: 'table', icon: 'table_chart' },
                ]"
              />
            </div>
          </div>
          <div v-else>Member List Private</div>
        </q-item-label>

        <q-item v-if="members.loading">
          <q-linear-progress indeterminate />
        </q-item>
        <template v-else-if="members.allowed">
          <member-list
            v-if="lookup.memberLayout == 'list'"
            :members="members.list"
            :system="system"
            :detect-pronouns="detectPronouns"
            @member-click="(member) => dialog.show({ system, member })"
          />
          <member-table
            v-if="lookup.memberLayout == 'table'"
            :members="members.list"
            :system="system"
            :detect-pronouns="detectPronouns"
            @member-click="(member) => dialog.show({ system, member })"
          />
        </template>
      </q-list>
    </div>
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
import MemberTable from 'src/pages/Lookup/System/MemberTable.vue';
import MemberList from 'src/pages/Lookup/System/MemberList.vue';

import { getNameSort } from 'src/util';
import { useServices } from 'src/lib/Services';

const route = useRoute();
const settingsStore = useSettingsStore();
const { pluralKit } = useServices();
const { detectPronouns, lookup } = storeToRefs(settingsStore);

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
