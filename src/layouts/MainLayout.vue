<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar :class="{ 'bg-deep-orange': isDev() }">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> PKStatus </q-toolbar-title>

        <div>
          <q-icon name="warning" />
          {{ version }}
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="row column justify-between"
      show-if-above
      bordered
    >
      <q-list class="col-auto">
        <q-item-label header>Pages</q-item-label>
        <q-item clickable to="/status">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Status</q-item-label>
            <q-item-label caption>Show system statuses</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/switch">
          <q-item-section avatar>
            <q-icon name="swap_horiz" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Switch</q-item-label>
            <q-item-label caption>Register a switch</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/lookup">
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Lookup</q-item-label>
            <q-item-label caption>Look up a system or alter</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Settings</q-item-label>
        <q-item clickable to="/manage">
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Systems</q-item-label>
            <q-item-label caption>Manage tracked systems</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>
            <q-item-label>General</q-item-label>
            <q-item-label caption>Other Settings</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Other</q-item-label>
        <q-item clickable @click="openProjectPage">
          <q-item-section avatar>
            <q-icon name="open_in_new" />
          </q-item-section>

          <q-item-section>
            <q-item-label>GitHub</q-item-label>
            <q-item-label caption>Project page</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="col-auto">
        <q-separator spaced />
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
import { homepage } from '../../package.json';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { getVersion, isDev } from 'src/util';

const settings = useSettingsStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const { dark } = storeToRefs(settings);
const version = getVersion();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function openProjectPage() {
  if ($q.platform.is.electron) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).PKStatusApi as any).openProjectPage();
  } else {
    open(homepage, '_blank');
  }
}
</script>
