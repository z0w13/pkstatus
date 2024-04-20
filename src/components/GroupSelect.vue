<template>
  <q-select
    v-if="!loading"
    v-model="model"
    :options="filteredSelectOptions"
    map-options
    use-input
    emit-value
    @filter="filterFunc"
  />
  <q-skeleton v-else class="q-mt-sm" height="48px" shape="rectangle" />
</template>

<script setup lang="ts">
import { useServices } from 'src/lib/Services';
import { Group } from 'src/models/Group';
import { computed, onMounted, ref } from 'vue';

const { pluralKit } = useServices();

const model = defineModel<string | Array<string>>();

const loading = ref(true);
const groups = ref<Array<Group>>([]);
const filteredSelectOptions = ref<Array<{ label: string; value: string }>>([]);
const selectOptions = computed(() =>
  groups.value.map((g) => ({ label: g.getName(), value: g.id })),
);

function filterFunc(val: string, update: (cb: () => void) => void) {
  console.log(val);
  if (val === '') {
    update(() => {
      filteredSelectOptions.value = selectOptions.value;
    });
    return;
  }

  update(() => {
    filteredSelectOptions.value = selectOptions.value.filter(
      ({ label, value }) =>
        label.toLowerCase().includes(val.toLowerCase()) ||
        value.toLowerCase().includes(val.toLowerCase()),
    );
  });
}

onMounted(async () => {
  groups.value = await pluralKit.getOwnGroups();
  filteredSelectOptions.value = selectOptions.value;
  model.value = Array.isArray(model.value) ? [...model.value] : model.value;
  loading.value = false;
});
</script>
