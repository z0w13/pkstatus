<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          link="/"
        />
        <essential-link
          title="Manage"
          caption="Manage tracked systems"
          icon="manage_accounts"
          link="/manage"
        />
        <q-item>
          <q-toggle
            @click="toggleDarkMode"
            v-model="darkMode"
            label="Toggle Dark Mode"
          />
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
import { useQuasar } from 'quasar';
import { version } from '../../package.json';

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const darkMode = ref(!!$q.localStorage.getItem('darkMode') || false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  $q.dark.set(darkMode.value);
  try {
    $q.localStorage.set('darkMode', darkMode.value);
  } catch (e) {
    console.error(e);
  }
}
</script>
