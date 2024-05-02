<template>
  <div class="row q-mt-lg bg-lighten">
    <q-list class="col">
      <q-item-label header>
        <div v-if="members.allowed" class="row">
          <div class="col self-center">Members ({{ members.list.length }})</div>
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
          :color-accent="lookup.colorAccent"
          @member-click="(member) => dialog.show({ system, member })"
        />
        <member-table
          v-if="lookup.memberLayout == 'table'"
          :members="members.list"
          :system="system"
          :detect-pronouns="detectPronouns"
          :color-accent="lookup.colorAccent"
          @member-click="(member) => dialog.show({ system, member })"
        />
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { System } from 'src/models/System';
import { Member } from 'src/models/Member';

import { useSettingsStore } from 'src/stores/settings-store';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import MemberTable from 'src/pages/Lookup/System/MemberTable.vue';
import MemberList from 'src/pages/Lookup/System/MemberList.vue';

const settingsStore = useSettingsStore();
const { detectPronouns, lookup } = storeToRefs(settingsStore);

defineProps<{
  system: System;
  members: {
    loading: boolean;
    allowed: boolean;
    list: Array<Member>;
  };
  dialog: typeof DescriptionDialog;
}>();
</script>
