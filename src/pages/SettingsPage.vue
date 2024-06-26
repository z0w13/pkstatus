<template>
  <q-page class="row justify-evenly">
    <div class="col col-sm-6 col-md-4">
      <page-title icon="settings" text="Settings" />
      <q-list class="bg-lighten q-pb-sm">
        <q-item-label header>General Settings</q-item-label>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>PluralKit Token</q-item-label>
            <q-item-label caption>
              (optional) PluralKit token, only needed for the switching UI
            </q-item-label>
            <q-input
              v-model.trim="newToken"
              type="password"
              label="Token"
              bottom-slots
              clearable
              :loading="tokenChecking"
              :error="tokenError"
              error-message="Invalid Token"
              @update:model-value="onTokenChange"
            >
              <template #prepend>
                <initial-fallback-avatar
                  v-if="tokenSystem"
                  :url="tokenSystem.avatarUrl"
                  :name="tokenSystem.getName(detectPronouns)"
                />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <q-item v-if="shouldCheckForUpdates($q)" tag="label">
          <q-item-section>
            <q-item-label>Check for Updates</q-item-label>
            <q-item-label caption>
              Periodically check GitHub to see if there's a new version of
              PKStatus available
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="checkUpdates" />
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>Display Settings</q-item-label>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Detect Pronouns</q-item-label>
            <q-item-label caption
              >Detect pronouns in system and member names and remove them, also
              shows them in the pronoun field if no pronouns are set
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="detectPronouns" />
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Show Card Details</q-item-label>
            <q-item-label caption>
              Show the table with system/member details on the popup info cards,
              or only name and description if disabled
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="showCardDetails" />
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Show Color Accents</q-item-label>
            <q-item-label caption>
              Show color accents on member and system cards, and also in various
              member lists
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle v-model="lookup.colorAccent" />
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item-label header>Update Settings</q-item-label>
        <q-item>
          <q-item-section>
            <q-select
              v-model="systemUpdateInterval"
              label="System Update Interval"
              :options="options"
              emit-value
              map-options
            >
              <template #prepend>
                <q-icon name="schedule" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              v-model="fronterUpdateInterval"
              label="Fronter Update Interval"
              :options="options"
              emit-value
              map-options
            >
              <template #prepend>
                <q-icon name="schedule" />
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-label caption>
            These are minimums, PKStatus increases the interval dynamically if
            it would exceed the PluralKit API limits with your settings
          </q-item-label>
        </q-item>
        <q-separator spaced />
        <id-section />
        <backup-section
          @restore="
            newToken = token;
            onTokenChange();
          "
        />
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { APIError } from 'pkapi.js';
import { debounce, useQuasar } from 'quasar';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';

import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';
import PageTitle from 'src/components/PageTitle.vue';
import IdSection from 'src/pages/Settings/IdSection.vue';
import BackupSection from 'src/pages/Settings/BackupSection.vue';
import { useServices } from 'src/lib/Services';
import { shouldCheckForUpdates } from 'src/lib/check-update';

const $q = useQuasar();
const { systemCache } = useServices();
const settingsStore = useSettingsStore();

const {
  detectPronouns,
  fronterUpdateInterval,
  showCardDetails,
  systemUpdateInterval,
  checkUpdates,
  lookup,
  token,
} = storeToRefs(settingsStore);

const newToken = ref(token.value);
const tokenChecking = ref(false);
const tokenError = ref(false);
const tokenSystem = ref<System | null>(null);

function onTokenChange() {
  tokenChecking.value = true;
  tokenSystem.value = null;
  tokenError.value = false;

  checkToken();
}

const checkToken = debounce(async () => {
  if (!newToken.value) {
    tokenChecking.value = false;
    token.value = '';
    return $q.notify({ type: 'positive', message: 'Token Cleared' });
  }

  try {
    tokenChecking.value = true;
    tokenSystem.value = await systemCache.fetchToken(newToken.value);

    $q.notify({
      type: 'positive',
      message: `Token Updated: ${tokenSystem.value.getName(detectPronouns.value)}`,
    });
    token.value = newToken.value;
  } catch (e) {
    if (e instanceof APIError && e.status == '401') {
      tokenError.value = true;
      newToken.value = null;
    }
  }

  tokenChecking.value = false;
}, 500);

const options = [
  { label: '10 Seconds', value: 10 },
  { label: '1 Minute', value: 60 },
  { label: '5 Minutes', value: 300 },
  { label: '1 Hour', value: 3600 },
  { label: '6 Hour', value: 3600 * 6 },
  { label: '1 Day', value: 86400 },
];
</script>
