<template>
  <q-table
    :hide-pagination="members.length <= 50"
    :pagination="{ rowsPerPage: 50 }"
    row-key="id"
    flat
    :rows="members"
    :columns="[
      {
        name: 'avatar',
        field: 'avatarUrl',
        label: 'Icon',
        align: 'left',
      },
      {
        name: 'name',
        field: 'name',
        label: 'Name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'pronouns',
        field: 'pronouns',
        label: 'Pronouns',
        align: 'left',
        sortable: true,
      },
      {
        name: 'message-count',
        field: 'messageCount',
        label: 'Msg #',
        sortable: true,
      },
      {
        name: 'last-message',
        field: 'lastMessageAt',
        label: 'Last Message',
        sortable: true,
      },
    ]"
    @row-click="(_, member) => emit('memberClick', member)"
  >
    <template #body-cell-avatar="props">
      <q-td :props="props">
        <initial-fallback-avatar
          :url="props.value"
          :name="props.row.name"
          size="24px"
        />
      </q-td>
    </template>
    <template #body-cell-name="props">
      <q-td :props="props">
        {{ props.row.getName(detectPronouns) }}
      </q-td>
    </template>
    <template #body-cell-pronouns="props">
      <q-td :props="props">
        {{ props.row.getPronouns(detectPronouns) }}
      </q-td>
    </template>
    <template #body-cell-last-message="props">
      <q-td :props="props">
        <relative-time-display :time="props.value" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const emit = defineEmits<{
  (e: 'memberClick', member: Member): void;
}>();

defineProps<{
  system: System;
  members: Array<Member>;
  detectPronouns: boolean;
}>();
</script>
