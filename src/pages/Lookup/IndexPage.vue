<template>
  <q-page class="row justify-evenly">
    <div
      :class="{
        col: true,
        'col-sm-6 col-md-4':
          lookup.memberLayout == 'list' ||
          !route.name?.toString().startsWith('lookup-system'),
        'col-md-8 col-lg-6':
          lookup.memberLayout == 'table' &&
          route.name?.toString().startsWith('lookup-system'),
      }"
    >
      <page-title icon="search" text="Lookup System/Member" />
      <div class="bg-lighten q-pa-md">
        <form @submit.prevent="doLookup">
          <div class="row q-ma-sm">
            <div class="col">
              <q-btn-toggle
                v-model="searchType"
                color="black"
                :options="[
                  { label: 'System', value: 'system' },
                  { label: 'Member', value: 'member' },
                  { label: 'Group', value: 'group' },
                ]"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col">
              <q-input
                ref="searchInput"
                v-model="searchValue"
                filled
                :autofocus="route.name == 'lookup'"
                :label="`Enter ${searchType} ID`"
              />
            </div>
            <div class="col-auto q-ml-md self-center">
              <q-btn
                round
                :disabled="searchValue.length < 5"
                color="primary"
                icon="search"
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="row q-mt-lg">
        <div class="col">
          <router-view />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import PageTitle from 'src/components/PageTitle.vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useSettingsStore } from 'src/stores/settings-store';

const router = useRouter();
const route = useRoute();
const settingsStore = useSettingsStore();

const { lookup } = storeToRefs(settingsStore);

const searchType = ref('system');
const searchValue = ref('');
const searchInput = ref();

onMounted(() => {
  watch(
    () => route.name,
    (routeName) => routeName == 'lookup' && searchInput.value.focus(),
    { immediate: true },
  );
});

async function doLookup() {
  router.push({ path: `/lookup/${searchType.value}/${searchValue.value}` });
  searchValue.value = '';
}
</script>
