<template>
  <template v-if="system">
    <system-card :system="system" flat />
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>Fronters</q-item-label>
        <template v-if="fronters?.allowed">
          <q-item
            :key="member.id"
            v-for="member of fronters.members"
            clickable
            @click="dialog.show({ member, system })"
          >
            <q-item-section avatar>
              <initial-fallback-avatar
                :name="member.getName(detectPronouns)"
                :url="member.avatarUrl"
              />
            </q-item-section>
            <q-item-section no-wrap>
              <q-item-label>
                {{ member.getName(detectPronouns) }}
              </q-item-label>
              <q-item-label caption v-if="member.getPronouns(detectPronouns)">
                {{ member.getPronouns(detectPronouns) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else>
          <q-linear-progress indeterminate />
        </q-item>
      </q-list>
    </div>
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>Members</q-item-label>
        <template v-if="members">
          <q-item
            :key="member.id"
            v-for="member of members"
            clickable
            @click="dialog.show({ member, system })"
          >
            <q-item-section avatar>
              <initial-fallback-avatar
                :name="member.getName(detectPronouns)"
                :url="member.avatarUrl"
              />
            </q-item-section>
            <q-item-section no-wrap>
              <q-item-label>
                {{ member.getName(detectPronouns) }}
              </q-item-label>
              <q-item-label caption v-if="member.getPronouns(detectPronouns)">
                {{ member.getPronouns(detectPronouns) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else>
          <q-linear-progress indeterminate />
        </q-item>
      </q-list>
    </div>
  </template>
  <q-linear-progress indeterminate v-else />
  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { pk } from 'src/boot/pkapi';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import SystemCard from 'src/components/SystemCard.vue';

import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { Fronters, useFrontersStore } from 'src/stores/fronters-store';
import { useSettingsStore } from 'src/stores/settings-store';
import { useSystemStore } from 'src/stores/system-store';

const route = useRoute();
const settingsStore = useSettingsStore();
const systemStore = useSystemStore();
const frontersStore = useFrontersStore();
const { detectPronouns } = storeToRefs(settingsStore);

const system = ref<System | null>(null);
const fronters = ref<Fronters | null>(null);
const members = ref<Array<Member> | null>(null);

const dialog = ref();

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId || Array.isArray(newId)) {
      return;
    }

    system.value = null;
    fronters.value = null;
    members.value = null;

    system.value = await systemStore.findOrFetch(newId);
    fronters.value = await frontersStore.findOrFetch(newId);
    members.value = Array.from(
      (await pk.getMembers({ system: newId })).values(),
    )
      .map((m) => Member.fromPKApi(m))
      .sort((a, b) =>
        a
          .getName(detectPronouns.value)
          .localeCompare(b.getName(detectPronouns.value)),
      );
  },
  { immediate: true },
);
</script>
