<template>
  <q-dialog v-model="showAvatar">
    <q-card>
      <img :src="avatarUrl" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const showAvatar = defineModel<boolean>();
defineProps<{ avatarUrl: string }>();
</script>
