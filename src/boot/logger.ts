import { defineBoot } from '@quasar/app-vite/wrappers';
import { Logger } from 'src/lib/Logger';
import { useSettingsStore } from 'src/stores/settings-store';

let loggerInstance: Logger | undefined;

export default defineBoot(() => {
  const settings = useSettingsStore();
  loggerInstance = Logger.restore(settings.log.lines, settings.log.level);
});

export function useLogger(): Logger {
  if (!loggerInstance) {
    throw Error('useLogger: logger is not defined');
  }

  return loggerInstance;
}
