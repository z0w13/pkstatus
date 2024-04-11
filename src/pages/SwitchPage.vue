<template>
  <q-page class="row justify-evenly">
    <div class="col col-md-8">
      <page-title icon="swap_horiz" text="Register Switch" />

      <q-banner v-if="!token" class="text-white bg-red">
        <template #avatar>
          <q-icon name="warning" color="white" />
        </template>
        You need to set your PluralKit token to use this feature
        <template #action>
          <q-btn
            to="/settings"
            flat
            class="bg-red text-white"
            label="Go To Settings"
          />
        </template>
      </q-banner>
      <div v-else class="bg-lighten q-pa-lg">
        <div class="row q-col-gutter-md q-mb-md" style="height: 64px">
          <template v-if="loading && false">
            <div class="col-auto self-center">
              <q-skeleton type="rect" width="121px" height="21px" />
            </div>
            <div class="col">
              <q-skeleton type="QAvatar" />
            </div>
          </template>
          <template v-else>
            <div class="col-auto self-center">Selected Fronters:</div>
            <div class="col relative-position">
              <initial-fallback-avatar
                v-for="[idx, fronter] in fronters.entries()"
                :key="fronter.id"
                :style="`left: ${(fronters.length - idx - 1) * 25 + 5}px; position: absolute; box-shadow: 0 0 2px 2px black`"
                :url="fronter.avatarUrl"
                :name="fronter.getName(detectPronouns)"
              />
            </div>
          </template>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-sm-6 col-12">
            <q-select
              v-if="!!members.length"
              v-model="primaryFronterId"
              bottom-slots
              emit-value
              map-options
              :options="options"
              label="Primary Fronter"
            >
              <template v-if="primaryFronter" #append>
                <initial-fallback-avatar
                  :url="primaryFronter.avatarUrl"
                  :name="primaryFronter.getName(detectPronouns)"
                />
              </template>
            </q-select>
            <q-skeleton v-else class="QInput" height="48px" />
          </div>
          <div class="col-sm-6 col-12">
            <q-input
              v-if="!!members.length"
              v-model="searchText"
              bottom-slots
              label="Search"
            />
            <q-skeleton v-else class="QInput" height="48px" />
          </div>
        </div>

        <div v-if="!!filteredMembers.length" class="row q-col-gutter-md">
          <div
            v-for="member of filteredMembers"
            :key="member.id"
            class="col-md-3 col-4"
          >
            <labeled-tile
              style="
                box-shadow: 0px 0px 3px 3px var(--q-primary);
                user-select: none;
              "
              :img="member.avatarUrl"
              :label="member.getName(detectPronouns)"
              :caption="member.getPronouns(detectPronouns)"
              :flat="!selected.includes(member.id)"
              size="100%"
              @click="toggleMember(member.id)"
            />
          </div>
        </div>
        <div v-else class="row q-col-gutter-md q-mt-md">
          <div v-for="idx of 6" :key="idx" class="col-md-3 col-4">
            <q-skeleton type="rect" style="aspect-ratio: 1/1" />
          </div>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            fab
            class="self-end"
            icon="swap_horiz"
            color="primary"
            :disabled="loading"
            :loading="loading"
            @click="doSwitch"
          />
        </q-page-sticky>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { APIError } from 'pkapi.js';
import { pk } from 'src/boot/pkapi';

import { caseInsensitiveIncludes, getNameSort, notEmpty } from 'src/util';
import { useSettingsStore } from 'src/stores/settings-store';
import { useServices } from 'src/lib/Services';
import { Member } from 'src/models/Member';

import PageTitle from 'src/components/PageTitle.vue';
import LabeledTile from 'src/components/StatusPage/Tile/LabeledTile.vue';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

const $q = useQuasar();
const settingsStore = useSettingsStore();
const { pluralKit } = useServices();
const { detectPronouns, token } = storeToRefs(settingsStore);

const loading = ref(true);
const searchText = ref('');
const primaryFronterId = ref('');
const selected = ref<Array<string>>([]);
const members = ref<Array<Member>>([]);

// Computed
const primaryFronter = computed(() =>
  members.value.find((m) => m.id == primaryFronterId.value),
);

// To display list of (selected) fronters
// reversed so the main fronter shows on top
const fronters = computed(() =>
  [...selected.value.values()]
    .map((id) => memberById(id))
    .filter(notEmpty)
    .toReversed(),
);

// Options for the main fronter dropdown
const options = computed(() =>
  [...selected.value.values()].map((value) => ({
    value,
    label: memberById(value)?.getName(detectPronouns.value),
  })),
);

// Search results
const filteredMembers = computed(() =>
  members.value.filter(
    (m) =>
      caseInsensitiveIncludes(m.name, searchText.value) ||
      caseInsensitiveIncludes(m.displayName || '', searchText.value),
  ),
);

// Callbacks
function toggleMember(id: string) {
  selected.value.includes(id)
    ? selected.value.splice(selected.value.indexOf(id), 1)
    : selected.value.push(id);

  // If there's no primary fronter selected set it to this one
  if (primaryFronterId.value == '') {
    primaryFronterId.value = id;
  }

  // If primary fronter was removed from the list select the next member as primary
  if (!selected.value.includes(primaryFronterId.value)) {
    primaryFronterId.value = selected.value[0];
  }
}

// Watchers
watch(primaryFronterId, (val) => {
  // Primary fronter is already first on the list, do nothing
  if (selected.value[0] == val) {
    return;
  }

  selected.value.splice(selected.value.indexOf(val), 1);
  selected.value.unshift(val);
});

async function doSwitch() {
  loading.value = true;
  if (!token.value) {
    return;
  }

  try {
    await pk.createSwitch({
      members: selected.value,
      token: token.value,
    });
    showSuccessMessage(selected.value);
  } catch (e) {
    if (!(e instanceof APIError)) {
      throw e;
    }

    $q.notify({
      type: 'negative',
      message: `${e.status}: ${e.message} (${e.code})`,
    });
  } finally {
    loading.value = false;
  }
}

function showSuccessMessage(newFronters: Array<string>): void {
  if (newFronters.length == 0) {
    $q.notify({
      type: 'positive',
      message: 'Switch-out registered.',
    });
  } else if (newFronters.length == 1) {
    const name =
      memberById(newFronters[0])?.getName(detectPronouns.value) ?? 'Unknown';

    $q.notify({
      type: 'positive',
      message: `Switch registered. Current fronter is now ${name}.`,
    });
  } else {
    const names = newFronters.map(
      (m) => memberById(m)?.getName(detectPronouns.value) ?? m,
    );

    $q.notify({
      type: 'positive',
      message: `Switch registered. Current fronters are now ${names.join(', ')}.`,
    });
  }
}

// Utility
function memberById(id: string): Member | null {
  return members.value.find((m) => m.id == id) || null;
}

onMounted(async () => {
  if (!token.value) {
    return;
  }

  // Get system
  const system = await pluralKit.getSystemForToken(token.value);

  // Load members/fronters
  members.value = (await pluralKit.getMembers(system.id, token.value)).toSorted(
    getNameSort(detectPronouns.value),
  );

  const lastSwitch = await pluralKit.getFronters(system.id, token.value);

  // If there's no members we can't populate with previous data
  if (lastSwitch.members.length > 0) {
    primaryFronterId.value = lastSwitch.members[0].id;
    selected.value = lastSwitch.members.map((m) => m.id);
  }

  loading.value = false;
});
</script>
