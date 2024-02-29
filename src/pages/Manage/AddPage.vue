<template>
  <q-page class="row justify-evenly">
    <q-form class="col col-sm-6 col-md-4" filled @submit="onSubmit">
      <q-card-section class="q-pb-none q-pt-md">
        <div class="row items-center no-wrap">
          <div class="col-auto q-mr-sm">
            <q-btn to="/manage" dense icon="arrow_back" />
          </div>
          <div class="col text-subtitle1">Add System</div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          label="System or Discord ID *"
          v-model="newId"
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
          :img="nonEmptyStringOrNull(newSys.avatar_url)"
          size="100%"
        />
      </q-card-section>

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
import { APIError, ISystem } from 'pkapi.js';
import { pk } from 'boot/pkapi';
import { debounce, useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { useSystemStore } from 'src/stores/system-store';
import { nonEmptyStringOrNull } from 'src/util';
import { useRouter } from 'vue-router';
import LabeledTile from 'src/components/StatusPage/Tile/LabeledTile.vue';

const $q = useQuasar();
const router = useRouter();
const systemStore = useSystemStore();

const newId = ref('');
const newSys = ref<ISystem | null>(null);
const errorMessage = ref('');
const isLoading = ref(false);

function is404(e: unknown): boolean {
  return e instanceof APIError && e.status == '404';
}

const onChange = debounce(async function (id: string) {
  const system = id.trim();
  try {
    newSys.value = await pk.getSystem({ system });
  } catch (e) {
    if (is404(e)) {
      errorMessage.value = `Couldn't find system ${system}`;
      return;
    }
  } finally {
    isLoading.value = false;
  }
}, 500);

watch(newId, () => {
  newSys.value = null;
  errorMessage.value = '';

  if (newId.value.trim() == '') {
    onChange.cancel();
    isLoading.value = false;

    return;
  }

  isLoading.value = true;
  onChange(newId.value);
});

async function onSubmit() {
  try {
    await systemStore.addSystem(newId.value);
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
