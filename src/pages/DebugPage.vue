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
          <div class="row">
            <h3 class="q-my-md col">Application Logs</h3>
            <div class="col-auto self-center">
              <q-btn
                aria-label="Clear Log"
                flat
                icon="delete"
                @click="clearLog"
              />
            </div>
          </div>
          <table class="log-entries">
            <log-entry
              v-for="line in logger.lines.toReversed()"
              :key="line.time"
              :line="line"
            />
          </table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { copyToClipboard, useQuasar } from 'quasar';

import { useLogger } from 'src/boot/logger';
import { getVersion, sanitizeLogMessage } from 'src/util';

import PageTitle from 'src/components/PageTitle.vue';
import LogEntry from 'src/components/DebugPage/LogEntry.vue';

const $q = useQuasar();
const logger = useLogger();

const infoText = `
App: ${getVersion()}
Quasar: v${$q.version}

${JSON.stringify($q.platform.is, null, 2)}
`.trim();

function generateClipboardText(): string {
  const outLines = [
    '# Info',
    '',
    `**App:** ${getVersion()}`,
    `**Quasar:** ${$q.version}`,
    '',
    '## Platform',
    '```json',
    JSON.stringify($q.platform.is, null, 2),
    '```',
    '',
    '# Logs',
    '',
  ];

  for (const logLine of logger.lines.toReversed()) {
    outLines.push(
      `## ${dayjs(logLine.time).format('YYYY-MM-DD HH:mm:ss')} | ${logLine.level}`,
      '```',
      sanitizeLogMessage(logLine.message),
      '```',
    );
    if (logLine.error) {
      outLines.push(
        '### Error',
        '```',
        sanitizeLogMessage(logLine.error),
        '```',
      );
    }
    if (logLine.stack) {
      outLines.push(
        '### Stack',
        '```',
        sanitizeLogMessage(logLine.stack),
        '```',
      );
    }
  }

  return outLines.join('\n');
}

function copyInfoToClipboard() {
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
  }).onOk(() => {
    copyToClipboard(generateClipboardText())
      .then(() => $q.notify({ message: 'Log Copied' }))
      .catch((err) =>
        $q.notify({ message: `Couldn't copy to clipboard: ${err?.message}` }),
      );
  });
}

function clearLog() {
  $q.dialog({
    title: 'Warning!',
    color: 'warning',
    message: 'This will wipe the entire log, are you sure?',
    html: true,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    logger.clear();
  });
}
</script>
