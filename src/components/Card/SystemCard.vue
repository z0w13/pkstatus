<template>
  <q-card>
    <q-card-section class="row">
      <div class="col-auto self-center">
        <initial-fallback-avatar
          v-if="system.avatarUrl"
          size="64px"
          :url="system.avatarUrl"
          :name="system.getName(detectPronouns)"
          @click="showAvatar = !!system.avatarUrl"
        />
      </div>
      <div class="col q-ml-md self-center">
        <fitty style="line-height: 100%" :options="{ maxSize: 100 }">
          {{ system.getName(detectPronouns) }}
        </fitty>
      </div>
    </q-card-section>
    <img v-if="system.bannerUrl" :src="system.bannerUrl" />
    <q-card-actions
      class="bg-primary text-white"
      :style="
        lookup.colorAccent
          ? `min-height: 52px; background-color: #${system.color} !important;`
          : ''
      "
    >
      <q-btn
        v-if="popup"
        color="dark"
        label="View"
        :to="`/lookup/system/${system.id}`"
      />

      <!-- Follow/Unfollow Buttons -->
      <q-btn
        v-if="!systemStore.has(system.id)"
        color="dark"
        icon="group_add"
        label="Follow"
        @click="followSystem(system.id)"
      />
      <q-btn
        v-else
        color="dark"
        icon="group_remove"
        label="Unfollow"
        @click="unfollowSystem(system.id)"
      />
    </q-card-actions>
    <q-card-section v-if="details" class="q-pt-none">
      <q-markup-table flat separator="horizontal" style="overflow: hidden">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ system.formatId(idOpts) }}</td>
          </tr>
          <tr>
            <td>Created At</td>
            <td>{{ system.createdAt.format('YYYY-MM-DD') }}</td>
          </tr>
          <tr>
            <td>Tag</td>
            <td>{{ system.tag }}</td>
          </tr>
          <tr v-if="system.getPronouns(detectPronouns)">
            <td>Pronouns</td>
            <td>{{ system.getPronouns(detectPronouns) }}</td>
          </tr>
          <tr v-if="system.color">
            <td>Color</td>
            <td
              :style="{
                color: `#${system.color}`,
                fontSize: '48px',
                lineHeight: '16px',
                textIndent: '-4px',
              }"
            >
              &bull;
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="system.description.length > 0">
      <pre class="description">{{ system.description }}</pre>
    </q-card-section>
    <avatar-dialog
      v-if="system.avatarUrl"
      v-model="showAvatar"
      :avatar-url="system.avatarUrl"
    />
  </q-card>
</template>

<script setup lang="ts">
import { Fitty } from '@lumenpink/vue3-fitty';
import { storeToRefs } from 'pinia';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

import { System } from 'src/models/System';
import { useSettingsStore } from 'src/stores/settings-store';
import { useSystemStore } from 'src/stores/system-store';
import { ref } from 'vue';
import AvatarDialog from 'src/components/Card/AvatarDialog.vue';
import { is404 } from 'src/util';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const settings = useSettingsStore();
const systemStore = useSystemStore();

const { detectPronouns, lookup, id: idOpts } = storeToRefs(settings);
const showAvatar = ref(false);

withDefaults(
  defineProps<{ system: System; details?: boolean; popup?: boolean }>(),
  {
    details: true,
    popup: false,
  },
);

async function followSystem(id: string) {
  try {
    await systemStore.add(id);
  } catch (e) {
    if (is404(e)) {
      return $q.notify({
        type: 'negative',
        message: `Error adding system ${id}`,
        caption: `${e.status}: ${e.message} (${e.code})`,
      });
    }

    throw e;
  }
}

function unfollowSystem(id: string) {
  systemStore.delete(id);
}
</script>

<style scoped lang="css">
td:first-child {
  padding-left: 0 !important;
}
td:last-child {
  padding-right: 0 !important;
}
</style>
