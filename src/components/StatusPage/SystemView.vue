<template>
  <div class="col-auto" style="width: 250px">
    <q-card flat>
      <q-img ratio="1" :src="system.avatar_url">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ system.name }}
        </div>
      </q-img>

      <q-card-section v-if="showSystemDescription">
        <span v-html="system?.description?.replaceAll('\n', '<br />')" />
      </q-card-section>
    </q-card>
  </div>
  <template v-if="fronters">
    <template v-if="fronters.allowed">
      <alter-view
        :fronter="fronter"
        :key="fronter.id"
        :show-fronter-description="showFronterDescription"
        v-for="fronter of fronters.members.values()"
      />
    </template>
    <template v-else>
      <div class="col-auto">
        <q-card flat>
          <q-card-section> No Access To System Fronters </q-card-section>
        </q-card>
      </div>
    </template>
  </template>
  <div v-else class="row justify-center">
    <q-spinner color="primary" size="3em" />
  </div>
</template>

<script setup lang="ts">
import { ExtendedSystem } from 'stores/system-store';
import { ExtendedSwitch } from 'stores/fronters-store';
import AlterView from 'src/components/StatusPage/AlterView.vue';

export interface Props {
  system: ExtendedSystem;
  fronters?: ExtendedSwitch;

  showUpdateTime: boolean;
  showSystemDescription: boolean;
  showFronterDescription: boolean;
}

defineProps<Props>();
</script>
