<template>
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
          :color-accent="lookup.colorAccent"
          @member-click="(member) => dialog.show({ system, member })"
        />
        <member-table
          v-else-if="lookup.memberLayout == 'table'"
          :members="fronters.members"
          :system="system"
          :detect-pronouns="detectPronouns"
          :color-accent="lookup.colorAccent"
          @member-click="(member) => dialog.show({ system, member })"
        />
      </template>
      <q-item v-else-if="!fronters">
        <q-linear-progress indeterminate />
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';

import { useSettingsStore } from 'src/stores/settings-store';

import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import MemberTable from 'src/pages/Lookup/System/MemberTable.vue';
import MemberList from 'src/pages/Lookup/System/MemberList.vue';

const settingsStore = useSettingsStore();
const { detectPronouns, lookup } = storeToRefs(settingsStore);

defineProps<{
  system: System;
  fronters: Fronters | null;
  dialog: typeof DescriptionDialog;
}>();
</script>
