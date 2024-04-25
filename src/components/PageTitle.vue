<template>
  <q-card-section class="q-py-md page-title">
    <div class="row items-center no-wrap">
      <div class="col-auto q-mr-sm">
        <q-icon :name="icon" size="24px" />
      </div>
      <div class="col text-subtitle1">{{ text }}</div>
      <div class="col-auto">
        <slot name="after" />
      </div>
    </div>
  </q-card-section>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  text: string;
}>();
</script>

<style lang="scss">
.body--dark .page-title {
  background: $dark-page;
}

.body--light .page-title {
  background: #fff;
}
</style>
