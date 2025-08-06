<template>
  <tr class="bg-lighten">
    <td class="timestamp q-pa-sm" :rowspan="rowSpan" valign="top">
      {{ dayjs(line.time).format('YYYY-MM-DD HH:mm:ss') }}
    </td>
    <td class="q-pa-sm" valign="top">message</td>
    <td class="q-pa-sm">
      <pre class="q-ma-none">{{ sanitizeLogMessage(line.message) }}</pre>
    </td>
  </tr>
  <template v-if="line.error">
    <tr class="bg-lighten">
      <td class="q-pa-sm" valign="top">error</td>
      <td class="q-pa-sm">
        <pre class="q-ma-none">{{ sanitizeLogMessage(line.error) }}</pre>
      </td>
    </tr>
  </template>
  <template v-if="line.stack">
    <tr class="bg-lighten">
      <td class="q-pa-sm" valign="top">stack</td>
      <td class="q-pa-sm">
        <pre class="q-ma-none">{{ sanitizeLogMessage(line.stack) }}</pre>
      </td>
    </tr>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sanitizeLogMessage } from 'src/util';
import { LogEntry } from 'src/stores/log-store';
import dayjs from 'dayjs';

const props = defineProps<{ line: LogEntry }>();
const rowSpan = computed(
  () => 1 + (props.line.error ? 1 : 0) + (props.line.stack ? 1 : 0),
);
</script>

<style lang="scss" scoped>
.log-entries .timestamp {
  white-space: nowrap;
}
</style>
