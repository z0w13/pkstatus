<template>
  <div class="row q-mt-lg bg-lighten">
    <q-list class="col">
      <q-item-label
        v-if="groups.allowed"
        style="line-height: 32px !important"
        header
      >
        Groups
        <span v-if="!groups.loading">({{ groups.list.length }})</span>
      </q-item-label>
      <q-item-label v-else header> Group List Private </q-item-label>
      <q-item v-if="groups.loading">
        <q-linear-progress indeterminate />
      </q-item>
      <template v-else-if="groups.allowed">
        <q-item
          v-for="group of groups.list"
          :key="group.id"
          clickable
          :class="{
            'color-accent': lookup.colorAccent,
            'bg-lighten': !$q.dark.isActive,
          }"
          :style="
            (group.color && lookup.colorAccent
              ? `border-left-color: #${group.color};`
              : '') +
            ($q.dark.isActive ? 'background-color: var(--q-dark);' : '')
          "
          @click="dialog.show({ system, group })"
        >
          <q-item-section avatar>
            <initial-fallback-avatar
              :name="group.getName()"
              :url="group.icon"
            />
          </q-item-section>
          <q-item-section no-wrap>
            {{ group.getName() }}
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { System } from 'src/models/System';
import { Group } from 'src/models/Group';

import { useSettingsStore } from 'src/stores/settings-store';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import DescriptionDialog from 'src/components/DescriptionDialog.vue';

const settingsStore = useSettingsStore();
const { lookup } = storeToRefs(settingsStore);

defineProps<{
  system: System;
  groups: {
    loading: boolean;
    allowed: boolean;
    list: Array<Group>;
  };
  dialog: typeof DescriptionDialog;
}>();
</script>
