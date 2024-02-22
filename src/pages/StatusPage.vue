<template>
  <q-page class="row justify-evenly">
    <div class="container col-10">
      <div class="row justify-left q-pa-md">
        <div class="col-auto">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              icon="settings"
              label="Settings"
            >
              <q-item>
                <q-item-section>
                  <q-item-label>Show Update Time</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showUpdateTime" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Show System Descriptionn</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showSystemDescription" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Show Fronter Descriptionn</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle v-model="showFronterDescription" />
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
        </div>
      </div>
      <template
        :key="id"
        v-for="[id, system] in Object.entries(systemStore.systems)"
      >
        <div
          class="row justify-left"
          v-if="showUpdateTime && frontersStore.fronters[id]"
        >
          <div class="col-auto">
            <relative-time-display
              :time="frontersStore.fronters[id].lastUpdated"
            />
          </div>
        </div>
        <div class="row justify-left q-pa-md q-col-gutter-md">
          <system-view
            :system="system"
            :fronters="frontersStore.fronters[id]"
            :show-update-time="showUpdateTime"
            :show-system-description="showSystemDescription"
            :show-fronter-description="showFronterDescription"
          />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSystemStore } from 'src/stores/system-store';
import { useFrontersStore } from 'src/stores/fronters-store';
import SystemView from 'src/components/StatusPage/SystemView.vue';
import RelativeTimeDisplay from 'src/components/RelativeTimeDisplay.vue';

const systemStore = useSystemStore();
const frontersStore = useFrontersStore();

const showSystemDescription = ref(false);
const showFronterDescription = ref(false);
const showUpdateTime = ref(false);

async function updateSystemInfo() {
  for (const system of Object.values(systemStore.systems)) {
    if (
      !Object.prototype.hasOwnProperty.call(frontersStore.fronters, system.id)
    ) {
      frontersStore.addFronters(system.id);
      return; //  Only update one at a time
    }
  }

  const oldestEntry = Object.values(frontersStore.fronters).sort((a, b) =>
    a.lastUpdated > b.lastUpdated ? 1 : -1,
  )[0];

  // Don't update if it was more recently than 5 seconds ago
  if (Date.now() - oldestEntry.lastUpdated > 5000) {
    frontersStore.updateFronters(oldestEntry.system);
  }
}

let updateInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  updateSystemInfo();
  updateInterval = setInterval(updateSystemInfo, 5000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
});
</script>
