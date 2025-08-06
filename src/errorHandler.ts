import { getCurrentInstance } from 'vue';
import { Notify } from 'quasar';
import { HTTPError } from 'pkapi-ts/errors';
import { useLogStore } from 'src/stores/log-store';
import { isDev } from 'src/util';

function maybeStringStack(err: unknown): string | null {
  const stackErr = err as { stack?: string };
  return typeof stackErr?.stack === 'string' ? stackErr.stack : null;
}

function logPluralKitApiError(err: HTTPError): void {
  useLogStore().log(
    `PluralKit API Error: ${err.message ?? err.statusText}`,
    JSON.stringify(err, null, 2),
    maybeStringStack(err),
  );

  Notify.create({
    type: 'warning',
    message: 'PluralKit API Error',
    caption: err.message ?? err.statusText,
  });
}

function logError(err: Error): void {
  useLogStore().log(
    `${err.name}: ${err.message}`,
    JSON.stringify(err, null, 2),
    maybeStringStack(err),
  );
  Notify.create({
    type: 'warning',
    message: `${err.name}: ${err.message}`,
  });
}

function logString(err: string): void {
  useLogStore().log(`Error: ${err}`, err, null);
  Notify.create({
    type: 'warning',
    message: err,
  });
}

function logUnknown(err: unknown): void {
  useLogStore().log(
    `Error: ${String(err)}`,
    JSON.stringify(err, null, 2),
    maybeStringStack(err),
  );
  Notify.create({
    type: 'warning',
    message: 'Unknown error',
    caption: String(err),
  });
}

function log(err: unknown): void {
  if (err instanceof HTTPError) {
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
    useLogStore().log(
      `Vue Error: ${String(error)}`,
      JSON.stringify({ error, info }, null, 2),
      maybeStringStack(error),
    );

    Notify.create({
      type: 'error',
      message: 'Vue Error',
      caption: String(error),
    });
  };

  app.config.warnHandler = (warning, _instance, info) => {
    useLogStore().log(
      `Vue Warning: ${warning}`,
      JSON.stringify({ warning, info }, null, 2),
      null,
    );
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
  const methods = ['trace', 'debug', 'info', 'warn', 'error'] as const;
  for (const method of methods) {
    const origMethod = console[method].bind(console);
    console[method] = (...args) => {
      origMethod(...args);

      const argString = stringifyArgs(args).join(', ');
      if (method == 'error') {
        Notify.create({
          type: 'warning',
          message: argString,
        });
      }

      useLogStore().log(`console.${method}: ${argString}`, null, null);
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
