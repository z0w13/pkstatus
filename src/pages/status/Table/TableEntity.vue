<template>
  <div>
    <q-item dense class="q-pa-none">
      <q-item-section avatar class="col-auto q-pr-sm">
        <initial-fallback-avatar
          v-if="!icon"
          :name="label"
          :url="img"
          :size="size"
          :square="square"
          :color="color"
        />
        <q-avatar
          v-else
          :color="color"
          :icon="icon"
          :size="size"
          :square="square"
        />
      </q-item-section>
      <q-item-section class="col-auto">
        <q-item-label>
          {{ label }}

          <q-icon name="info" v-if="tooltip">
            <q-tooltip v-if="tooltip && $q.screen.gt.sm">
              <pre class="description">{{ tooltip }}</pre>
            </q-tooltip>
          </q-icon>
        </q-item-label>
        <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

withDefaults(
  defineProps<{
    tooltip?: string | null;
    label: string;
    caption?: string | null;
    icon?: string | null;
    color?: string;
    img?: string | null;
    size: string;
    square?: boolean;
  }>(),
  {
    color: 'primary',
    square: false,
  },
);
</script>
