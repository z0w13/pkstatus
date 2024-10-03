<template>
  <q-page class="row justify-evenly">
    <q-form class="col col-sm-6 col-md-4" filled @submit="onSubmit">
      <page-title icon="group_add" text="Add System" />
      <q-card-section class="q-pt-none">
        <q-input
          v-model.trim="newId"
          filled
          autofocus
          label="System or Discord ID *"
          :loading="isLoading"
          bottom-slots
          :error="!!errorMessage"
          :error-message="errorMessage"
        />
      </q-card-section>

      <q-card-section v-if="newSys" class="q-py-none">
        <labeled-tile
          :label="newSys.name || ''"
          :caption="newSys.pronouns"
          :img="newSys.avatarUrl"
          :fallback-icon="matGroups"
          size="100%"
        />
      </q-card-section>

      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-btn
          fab
          class="self-end"
          icon="arrow_back"
          color="primary"
          to="/manage"
        />
      </q-page-sticky>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          class="self-end"
          icon="save"
          color="primary"
          type="submit"
          :disable="!newSys"
        />
      </q-page-sticky>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { debounce, useQuasar } from 'quasar';
import { ref, watch } from 'vue';

import { useSystemStore } from 'src/stores/system-store';
import { useServices } from 'src/lib/Services';
import { System } from 'src/models/System';

import { matGroups } from '@quasar/extras/material-icons';
import LabeledTile from 'src/components/StatusPage/Tile/LabeledTile.vue';
import PageTitle from 'src/components/PageTitle.vue';
import { is404 } from 'src/util';

const $q = useQuasar();
const router = useRouter();
const systemStore = useSystemStore();
const { pluralKit } = useServices();

const newId = ref('');
const newSys = ref<System | null>(null);
const errorMessage = ref('');
const isLoading = ref(false);

const onChange = debounce(async function (id: string) {
  try {
    newSys.value = await pluralKit.getSystem(id);
  } catch (e) {
    if (is404(e)) {
      errorMessage.value = `Couldn't find system ${id}`;
      return;
    }
  } finally {
    isLoading.value = false;
  }
}, 500);

watch(newId, () => {
  newSys.value = null;
  errorMessage.value = '';

  if (newId.value == '') {
    onChange.cancel();
    isLoading.value = false;

    return;
  }

  isLoading.value = true;
  onChange(newId.value);
});

async function onSubmit() {
  try {
    await systemStore.add(newId.value);
  } catch (e) {
    if (is404(e)) {
      errorMessage.value = `Couldn't find system ${newId.value}`;
      return;
    }

    throw e;
  }

  $q.notify('System Added');
  router.push({ path: '/manage' });
}
</script>
