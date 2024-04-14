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
          <q-btn flat to="/debug" style="text-transform: none">
            <q-icon v-if="isDev()" name="warning" />
            {{ version }}
          </q-btn>
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
      <q-dialog v-if="newVersion" v-model="updateDialogOpen" full-height>
        <q-card class="column">
          <q-item class="bg-positive text-white col-auto">
            <q-item-section avatar>
              <q-icon size="48px" name="browser_updated" />
            </q-item-section>
            <q-item-section>
              <q-item-label>New Version Available </q-item-label>
              <q-item-label caption class="text-white">{{
                newVersion.version
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn v-close-popup icon="close" class="text-white" flat round />
            </q-item-section>
          </q-item>
          <q-card-section class="col overflow-auto">
            <div
              class="changelog"
              v-html="markdownit({ html: false }).render(newVersion.changelog)"
            />
          </q-card-section>
          <q-card-actions class="col-auto" align="between">
            <q-btn
              icon="download"
              label="download"
              color="positive"
              flat
              @click="downloadUpdate"
            />
            <q-btn
              icon="do_not_disturb_on"
              label="skip this version"
              color="primary"
              square
              flat
              @click="skipUpdate"
            />
            <q-btn
              icon="close"
              label="ignore"
              color="negative"
              square
              flat
              @click="updateDialogOpen = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import markdownit from 'markdown-it';

import { homepage } from '../../package.json';
import { useSettingsStore } from 'src/stores/settings-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { UpdateInfo } from 'src/lib/check-update';
import { getVersion, isDev } from 'src/util';

const settings = useSettingsStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const { dark, ignoreVersion } = storeToRefs(settings);
const version = getVersion();

const props = defineProps<{ newVersion: UpdateInfo | null }>();
const updateDialogOpen = ref(!!props.newVersion);
watch(
  () => props.newVersion,
  (newVal) => {
    if (newVal) {
      updateDialogOpen.value = true;
    }
  },
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function skipUpdate() {
  if (!props.newVersion) {
    return;
  }

  ignoreVersion.value = props.newVersion.version;
  updateDialogOpen.value = false;
}

function downloadUpdate() {
  if (!props.newVersion) {
    return;
  }

  if ($q.platform.is.electron) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).PKStatusApi as any).openUrl(
      props.newVersion.assets.windows ?? props.newVersion.url,
    );
  } else if ($q.platform.is.android) {
    open(props.newVersion.assets.android ?? props.newVersion.url, '_blank');
  } else {
    open(props.newVersion.url, '_blank');
  }
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

<style lang="css">
.changelog h1 {
  margin-top: 0px;
  font-size: 48px !important;
  line-height: 1;
}
.changelog h2 {
  font-size: 36px !important;
  line-height: 1;
}
.changelog h3 {
  font-size: 24px !important;
  line-height: 1;
  margin-bottom: 0px;
}
.changelog ul {
  padding-left: 16px;
}
.changelog {
  font-size: 16px;
}
</style>
