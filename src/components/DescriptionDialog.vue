<template>
  <q-dialog v-model="visible">
    <q-card>
      <q-card-section class="row" style="line-height: 48px">
        <initial-fallback-avatar
          :name="obj?.getName() || ''"
          :url="obj?.avatarUrl"
          class="q-mr-md"
          size="40px"
        />
        <div class="text-h4">
          {{ obj?.getName() }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <pre class="description">{{ obj?.description }}</pre>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { ref } from 'vue';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

const visible = ref(false);
const obj = ref<System | Member>();

function show(newObj: System | Member) {
  visible.value = true;
  obj.value = newObj;
}

defineExpose({
  show,
});
</script>
