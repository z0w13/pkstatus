import { defineBoot } from '@quasar/app-vite/wrappers';
import { Logger } from 'src/lib/Logger';

let loggerInstance: Logger | undefined;

export default defineBoot(() => {
  loggerInstance = Logger.restore();
});

export function useLogger(): Logger {
  if (!loggerInstance) {
    throw Error('useLogger: logger is not defined');
  }

  return loggerInstance;
}
