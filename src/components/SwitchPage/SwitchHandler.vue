<template>
  <q-page class="row justify-evenly">
    <div class="row col-12">
      <div class="row column col-12">
        <!-- Title -->
        <div class="col-auto row justify-center">
          <page-title
            icon="swap_horiz"
            text="Register Switch"
            class="col-md-8 col-12"
          />
        </div>

        <div v-if="!token" class="row justify-center">
          <token-required-banner class="col-md-8 col-12" />
        </div>

        <template v-else>
          <front-switcher
            v-if="!loading"
            :groups="groups"
            :members="members"
            :initial-fronters="fronters"
            :saving="saving"
            @reset="onReset"
            @save="onSave"
          />
          <front-switcher-skeleton v-else />
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

import { APIError } from 'pkapi-ts/errors';
import MemberID from 'pkapi-ts/models/MemberID';

import { useSettingsStore } from 'src/stores/settings-store';
import { usePluralKit } from 'src/boot/pluralKit';
import { ellipsize } from 'src/util';

import { System } from 'src/models/System';
import { Group } from 'src/models/Group';
import { Member } from 'src/models/Member';
import { Fronters } from 'src/models/Fronters';

import PageTitle from 'src/components/PageTitle.vue';
import TokenRequiredBanner from 'src/components/TokenRequiredBanner.vue';
import FrontSwitcher from 'src/components/SwitchPage/FrontSwitcher.vue';
import FrontSwitcherSkeleton from 'src/components/SwitchPage/FrontSwitcherSkeleton.vue';

const $q = useQuasar();
const pluralKit = usePluralKit();
const { token, detectPronouns } = storeToRefs(useSettingsStore());

const loading = ref(true);
const saving = ref(false);

const members = ref<ReadonlyArray<Member>>([]);
const groups = ref<ReadonlyArray<Group>>([]);
const fronters = ref<ReadonlyArray<Member>>([]);

// callbacks
async function onReset() {
  await loadState();
}

async function onSave(newMembers: Array<string>) {
  saving.value = true;
  if (!token.value) {
    return;
  }

  try {
    const newFronters = await pluralKit.createSwitch(
      newMembers.map((m) => MemberID.parse(m)),
    );
    // NOTE: We shouldn't be able to call this without a system
    showSuccessMessage(newFronters!);
  } catch (e) {
    if (!(e instanceof APIError)) {
      throw e;
    }

    $q.notify({
      type: 'negative',
      message: `${e.status}: ${e.message} (${e.code})`,
    });
  }

  saving.value = false;
}

// methods
async function loadState() {
  if (!token.value) {
    // don't try loading anything without a token
    return;
  }

  loading.value = true;

  // Load members/fronters
  const system = await getSystem(); // Make sure we're logged in and handle invalid tokens
  if (!system) {
    return;
  }

  // load all data
  try {
    members.value = (await pluralKit.getOwnMembers()) ?? [];
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: "Switcher: couldn't retrieve system members",
      caption: ellipsize(String(e)),
    });
    return;
  }
  try {
    groups.value = (await pluralKit.getOwnGroups()) ?? [];
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: "Switcher: couldn't retrieve system groups",
      caption: ellipsize(String(e)),
    });
    return;
  }
  try {
    fronters.value = (await pluralKit.getOwnFronters())?.members ?? [];
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: "Switcher: couldn't retrieve system fronters",
      caption: ellipsize(String(e)),
    });
    return;
  }

  // finish loading
  loading.value = false;
}

async function getSystem(): Promise<System | null> {
  try {
    const system = await pluralKit.getOwnSystem();
    if (!system) {
      $q.notify({
        type: 'negative',
        message: "Couldn't retrieve own system for some reason",
      });
    }
    return system;
  } catch (e) {
    if (e instanceof APIError) {
      if (e.status == 401) {
        $q.notify({
          type: 'negative',
          message: 'Invalid Token',
        });
        return null;
      }
    }

    throw e;
  }
}

function showSuccessMessage(newFronters: Fronters): void {
  if (newFronters.members.length == 0) {
    $q.notify({
      type: 'positive',
      message: 'Switch-out registered.',
    });
  } else if (newFronters.members.length == 1) {
    const name =
      newFronters.members[0].getName(detectPronouns.value) ?? 'Unknown';

    $q.notify({
      type: 'positive',
      message: `Switch registered. Current fronter is now ${name}.`,
    });
  } else {
    const names = newFronters.members.map((m) =>
      m.getName(detectPronouns.value),
    );

    $q.notify({
      type: 'positive',
      message: `Switch registered. Current fronters are now ${names.join(', ')}.`,
    });
  }
}

// lifecycle
onMounted(async () => {
  await loadState();
});
</script>
