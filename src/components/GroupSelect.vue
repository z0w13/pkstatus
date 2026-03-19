<template>
  <q-select
    v-model="model"
    :options="filteredSelectOptions"
    map-options
    use-input
    emit-value
    :loading="loading"
    :readonly="loading"
    @filter="filterFunc"
  />
</template>

<script setup lang="ts">
import { usePluralKit } from 'boot/pluralKit';
import { useQuasar } from 'quasar';
import { Group } from 'src/models/Group';
import { ellipsize } from 'src/util';
import { computed, onMounted, ref } from 'vue';

const pluralKit = usePluralKit();
const $q = useQuasar();

const model = defineModel<string | Array<string>>();

const loading = ref(true);
const groups = ref<ReadonlyArray<Group>>([]);
const filteredSelectOptions = ref<Array<{ label: string; value: string }>>([]);
const selectOptions = computed(() =>
  groups.value.map((g) => ({ label: g.getName(), value: g.id })),
);

function filterFunc(val: string, update: (cb: () => void) => void) {
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
  let groupResult;
  try {
    groupResult = await pluralKit.getOwnGroups();
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: "GroupSelect: couldn't retrieve system groups",
      caption: ellipsize(String(e)),
    });
    return;
  }

  if (!groupResult) {
    throw new Error(
      "couldn't get own groups despite in GroupSelect but we shouldn't get here without a token",
    );
  }

  groups.value = groupResult;
  filteredSelectOptions.value = selectOptions.value;
  model.value = Array.isArray(model.value) ? [...model.value] : model.value;
  loading.value = false;
});
</script>
