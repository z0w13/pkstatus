<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> PKStatus </q-toolbar-title>

        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <essential-link
          title="Status"
          caption="Show system statuses"
          icon="people"
          link="/status"
        />
        <essential-link
          title="Manage"
          caption="Manage tracked systems"
          icon="manage_accounts"
          link="/manage"
        />
        <essential-link
          title="Settings"
          caption="Global settings"
          icon="settings"
          link="/settings"
        />
        <q-item clickable href="https://github.com/z0w13/pkstatus">
          <q-item-section avatar>
            <q-icon name="open_in_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>GitHub</q-item-label>
            <q-item-label caption>Project Page</q-item-label>
          </q-item-section>
        </q-item>
        <q-item tag="label">
          <q-item-section>
            <q-item-label>Dark Mode</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              v-model="dark"
              checked-icon="dark_mode"
              unchecked-icon="light_mode"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { version } from '../../package.json';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';

const settings = useSettingsStore();

const leftDrawerOpen = ref(false);
const { dark } = storeToRefs(settings);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
