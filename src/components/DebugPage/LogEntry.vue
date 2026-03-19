<template>
  <tr :class="idx % 2 == 0 ? 'row-even' : 'row-odd'">
    <td width="1" class="q-pa-sm text-bold" valign="top">date</td>
    <td width="1" class="timestamp q-pa-sm text-bold">
      {{ dayjs(line.time).format('YYYY-MM-DD HH:mm:ss') }}
    </td>
  </tr>
  <tr :class="idx % 2 == 0 ? 'row-even' : 'row-odd'">
    <td width="1" class="q-pa-sm" valign="top">type</td>
    <td width="1" :class="['q-pa-sm', colorClass()]">
      {{ line.level }}
    </td>
  </tr>
  <tr :class="idx % 2 == 0 ? 'row-even' : 'row-odd'">
    <td width="1" class="q-pa-sm" valign="top">message</td>
    <td class="q-pa-sm">
      <pre class="q-ma-none">{{ sanitizeLogMessage(line.message) }}</pre>
    </td>
  </tr>
  <template v-if="line.error">
    <tr :class="idx % 2 == 0 ? 'row-even' : 'row-odd'">
      <td width="1" class="q-pa-sm" valign="top">error</td>
      <td class="q-pa-sm">
        <pre class="q-ma-none">{{ sanitizeLogMessage(line.error) }}</pre>
      </td>
    </tr>
  </template>
  <template v-if="line.stack">
    <tr :class="idx % 2 == 0 ? 'row-even' : 'row-odd'">
      <td width="1" class="q-pa-sm" valign="top">stack</td>
      <td class="q-pa-sm">
        <pre class="q-ma-none">{{ sanitizeLogMessage(line.stack) }}</pre>
      </td>
    </tr>
  </template>
</template>

<script setup lang="ts">
import { sanitizeLogMessage } from 'src/util';
import { LogEntry } from 'src/lib/Logger';
import dayjs from 'dayjs';

const props = defineProps<{ line: LogEntry; idx: number }>();
function colorClass() {
  switch (props.line.level) {
    case 'debug':
      return 'text-positive';
    case 'info':
      return 'text-info';
    case 'warn':
      return 'text-warning';
    case 'error':
      return 'text-negative';
  }
}
</script>

<style lang="scss" scoped>
.log-entries .timestamp {
  white-space: nowrap;
}
</style>
