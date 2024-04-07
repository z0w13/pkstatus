<template>
  <q-page class="row justify-evenly">
    <div class="col col-sm-6 col-md-4">
      <div class="bg-lighten q-pa-md">
        <page-title icon="settings" text="Lookup System/Member" />
        <form @submit.prevent="lookup">
          <div class="row q-ma-sm">
            <div class="col">
              <q-btn-toggle
                v-model="searchType"
                color="black"
                :options="[
                  { label: 'System', value: 'system' },
                  { label: 'Member', value: 'member' },
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
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

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

async function lookup() {
  router.push({ path: `/lookup/${searchType.value}/${searchValue.value}` });
  searchValue.value = '';
}
</script>
