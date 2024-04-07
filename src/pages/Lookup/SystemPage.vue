<template>
  <template v-if="system">
    <system-card :system="system" flat />
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>
          <span v-if="!fronters || fronters.allowed">Fronters</span>
          <span v-else>Fronter List Private</span>
        </q-item-label>

        <template v-if="fronters?.allowed">
          <q-item
            v-for="member of fronters.members"
            :key="member.id"
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
              <q-item-label v-if="member.getPronouns(detectPronouns)" caption>
                {{ member.getPronouns(detectPronouns) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-item v-else-if="!fronters">
          <q-linear-progress indeterminate />
        </q-item>
      </q-list>
    </div>
    <div class="row q-mt-lg bg-lighten">
      <q-list class="col">
        <q-item-label header>
          <span v-if="members.allowed">Members</span>
          <span v-else>Member List Private</span>
        </q-item-label>

        <q-item v-if="members.loading">
          <q-linear-progress indeterminate />
        </q-item>
        <template v-else-if="members.allowed">
          <q-item
            v-for="member of members.list"
            :key="member.id"
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
              <q-item-label v-if="member.getPronouns(detectPronouns)" caption>
                {{ member.getPronouns(detectPronouns) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </template>
  <q-linear-progress v-else-if="status == 'loading'" indeterminate />
  <div
    v-else-if="status == 'forbidden'"
    class="row q-mt-lg q-pa-md bg-lighten q-pa-md"
  >
    <q-icon name="cross" />
    Not Allowed To View System
  </div>
  <div v-else-if="status == 'notfound'" class="row q-mt-lg q-pa-md bg-lighten">
    <q-icon name="error" />
    System Not Found
  </div>
  <description-dialog ref="dialog" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { APIError } from 'pkapi.js';

import { Member } from 'src/models/Member';
import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';
import { useSettingsStore } from 'src/stores/settings-store';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import DescriptionDialog from 'src/components/DescriptionDialog.vue';
import SystemCard from 'src/components/Card/SystemCard.vue';
import { getNameSort } from 'src/util';
import { useCacheStore } from 'src/stores/cache-store';

const route = useRoute();
const settingsStore = useSettingsStore();
const { pluralKit } = useCacheStore();
const { detectPronouns } = storeToRefs(settingsStore);

const status = ref<'loading' | 'forbidden' | 'notfound'>('loading');
const system = ref<System | null>(null);
const fronters = ref<Fronters | null>(null);
const members = ref<{
  loading: boolean;
  allowed: boolean;
  list: Array<Member>;
}>({
  loading: true,
  allowed: true,
  list: [],
});

const dialog = ref();

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId || Array.isArray(newId)) {
      return;
    }

    system.value = null;
    fronters.value = null;
    members.value.loading = true;
    members.value.list = [];

    try {
      system.value = await pluralKit.getSystem(newId);
    } catch (e) {
      if (e instanceof APIError) {
        if (e.status == '404') {
          // Not Found
          status.value = 'notfound';
        } else if (e.status == '403') {
          // Forbidden
          status.value = 'forbidden';
        }
      }
      return;
    }

    fronters.value = await pluralKit.getFronters(newId);

    try {
      members.value.list = (await pluralKit.getMembers(newId)).sort(
        getNameSort(detectPronouns.value),
      );

      members.value.loading = false;
      members.value.allowed = true;
    } catch (e) {
      if (e instanceof APIError && e.status == '403') {
        members.value = {
          loading: false,
          allowed: false,
          list: [],
        };
      } else {
        throw e;
      }
    }
  },
  { immediate: true },
);
</script>
