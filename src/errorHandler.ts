import { getCurrentInstance } from 'vue';
import { useQuasar } from 'quasar';
import { APIError } from 'pkapi.js';
import { useLogStore } from 'src/stores/log-store';
import { isDev } from 'src/util';

function logStack(err: unknown): void {
  const stackErr = err as { stack?: string };
  if (typeof stackErr?.stack === 'string') {
    useLogStore().log(stackErr.stack);
  }
}

function logPluralKitApiError(err: APIError): void {
  logStack(err);
  useLogStore().log(`API Error: ${JSON.stringify(err, null, 2)}`);
  useQuasar().notify({
    type: 'warning',
    message: 'API Error',
    caption: err.message ?? err.statusText,
  });
}

function logError(err: Error): void {
  logStack(err);
  useLogStore().log(`${err.name}: ${err.message}`);
  useQuasar().notify({
    type: 'warning',
    message: `${err.name}: ${err.message}`,
  });
}

function logString(err: string): void {
  useLogStore().log(`Error: ${err}`);
  useQuasar().notify({
    type: 'warning',
    message: err,
  });
}

function logUnknown(err: unknown): void {
  logStack(err);
  useLogStore().log(`Error: ${String(err)} | ${JSON.stringify(err, null, 2)}`);
  useQuasar().notify({
    type: 'warning',
    message: `${String(err)} | ${JSON.stringify(err, null, 2)}`,
  });
}

function log(err: unknown): void {
  if (err instanceof APIError) {
    logPluralKitApiError(err);
  } else if (err instanceof Error) {
    logError(err);
  } else if (typeof err === 'string') {
    logString(err);
  } else {
    logUnknown(err);
  }
}

function setupAppHandlers() {
  const app = getCurrentInstance()?.appContext.app;

  if (!app) {
    return;
  }

  app.config.errorHandler = (error, _instance, info) => {
    log(error);
    useLogStore().log(`Vue Info: ${info}`);
  };

  app.config.warnHandler = (warning, _instance, info) => {
    logString(warning); // warnings are always strings
    useLogStore().log(`Vue Info: ${info}`);
  };
}

function stringifyArgs(args: Array<unknown>): Array<string> {
  return args.map((arg) => {
    if (typeof arg === 'string') {
      return arg;
    } else if (
      typeof arg === 'number' ||
      typeof arg === 'bigint' ||
      typeof arg === 'boolean' ||
      typeof arg === 'symbol'
    ) {
      return arg.toString();
    } else if (arg === null || arg === undefined) {
      return typeof arg;
    } else {
      return JSON.stringify(arg);
    }
  });
}

function setupConsoleHandlers() {
  const methods = ['warn', 'error'] as const;
  for (const method of methods) {
    const origMethod = console[method].bind(console);
    console[method] = (...args) => {
      origMethod(...args);

      const argString = stringifyArgs(args).join(', ');
      if (method == 'error') {
        useQuasar().notify({
          type: 'warning',
          message: argString,
        });
      }

      useLogStore().log(`console.${method}: ${argString}`);
    };
  }
}

let handlerInstalled = false;
export default function setupErrorHandler() {
  // don't install the handler twice
  if (handlerInstalled) {
    return;
  }

  // don't intercept during development
  if (isDev()) {
    return;
  }

  window.addEventListener('error', (evt) => {
    log(evt.error);
  });
  setupAppHandlers();
  setupConsoleHandlers();

  handlerInstalled = true;
}
