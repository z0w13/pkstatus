<template>
  <q-page class="row justify-evenly">
    <div class="col">
      <page-title icon="bug_report" text="Troubleshooting Page">
        <template #after>
          <q-btn
            aria-label="Copy Info To Clipboard"
            flat
            icon="content_copy"
            @click="copyInfoToClipboard"
          />
        </template>
      </page-title>

      <div class="row justify-center">
        <div class="col q-mx-lg">
          <h3 class="q-my-md">Troubleshooting Info</h3>
          <pre class="bg-lighten q-pa-md">{{ infoText }}</pre>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col q-mx-lg">
          <h3 class="q-my-md">Application Logs</h3>
          <pre class="bg-lighten q-pa-md">{{ logText }}</pre>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { copyToClipboard, useQuasar } from 'quasar';

import { useLogStore } from 'src/stores/log-store';

import PageTitle from 'src/components/PageTitle.vue';
import { getVersion } from 'src/util';

const $q = useQuasar();
const { lines } = storeToRefs(useLogStore());

const logText = computed(() =>
  lines.value
    .toReversed()
    .map(
      (l) =>
        `${dayjs(l.time).format('YYYY-MM-DD HH:mm:ss')} | ${sanitizeLogMessage(l.message)}`,
    )
    .join('\n'),
);

const infoText = `
App: ${getVersion()}
Quasar: v${$q.version}
Platform: ${JSON.stringify($q.platform.is, null, 2)}
`.trim();

function sanitizeLogMessage(message: string): string {
  const tokenRegex = /[\w+/]{64}/g;
  return message.replaceAll(tokenRegex, '****PLURALKIT_API_TOKEN****');
}

async function copyInfoToClipboard() {
  $q.dialog({
    title: 'Warning!',
    color: 'warning',
    message:
      'The troubleshooting information may contain sensitive information, ' +
      'we did our best to strip things out, ' +
      'but please double check before pasting this anywhere, ' +
      '<strong>especially for API tokens</strong>',
    html: true,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await copyToClipboard(
      '==== INFO ====\n\n' +
        infoText +
        '\n\n==== LOGS ====\n\n' +
        logText.value,
    );
    $q.notify({ message: 'Log Copied' });
  });
}
</script>
