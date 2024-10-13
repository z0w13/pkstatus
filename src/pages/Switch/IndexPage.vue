<template>
  <q-page class="row justify-evenly">
    <div class="col col-sm-6 col-md-4">
      <page-title icon="history" text="Switch History" />
      <token-required-banner v-if="!token" />
      <template v-else>
        <q-markup-table v-if="switches" :flat="true" class="q-py-sm">
          <tr :key="switc.id" v-for="switc in switches">
            <td valign="top">
              {{ switc.timestamp.fromNow() }}
            </td>
            <td width="99%">
              <table-entity
                v-for="id of switc.members"
                :key="id"
                :img="memberCache.objects[id].avatarUrl"
                :size="'32px'"
                :label="memberCache.objects[id].getName()"
                :caption="memberCache.objects[id].getPronouns()"
                class="q-mb-sm"
                :square="true"
                :show-icon="true"
              />
            </td>
            <td>
              <q-btn-group unelevated>
                <q-btn dense icon="edit" color="primary" />
                <q-btn
                  dense
                  icon="delete"
                  color="negative"
                  @click="deleteSwitch(switc)"
                />
              </q-btn-group>
            </td>
          </tr>
        </q-markup-table>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import TableEntity from 'src/pages/status/Table/TableEntity.vue';

import PageTitle from 'src/components/PageTitle.vue';
import TokenRequiredBanner from 'src/components/TokenRequiredBanner.vue';

import { useQuasar } from 'quasar';
import { useServices } from 'src/lib/Services';
import { Switch } from 'src/models/Switch';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from 'src/stores/settings-store';

const $q = useQuasar();
const settingsStore = useSettingsStore();
const { token } = storeToRefs(settingsStore);
const { pluralKit, memberCache, systemSwitchCache } = useServices();
const switches = ref<Array<Switch> | null>(null); // null = loading

async function deleteSwitch(switc: Switch) {
  $q.dialog({
    title: 'Delete Switch?',
    message: `Delete switch from ${switc.timestamp.fromNow()} with fronters ${switc.members
      .map((m) => memberCache.objects[m].getName())
      .join(', ')}?`,
    persistent: true,
    cancel: true,
  }).onOk(async () => {
    await pluralKit.deleteSwitch({ switch: switc.id });
    switches.value = (
      await systemSwitchCache.fetch(
        (await pluralKit.getOwnSystem())!.id,
        token.value!,
      )
    ).switches;
  });
}

onMounted(async () => {
  await pluralKit.getOwnMembers();
  switches.value = (
    await systemSwitchCache.fetch(
      (await pluralKit.getOwnSystem())!.id,
      token.value!,
    )
  ).switches;
});
</script>
