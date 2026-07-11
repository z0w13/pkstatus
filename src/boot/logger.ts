import { defineBoot } from '#q-app';
import { Logger } from '@/lib/Logger';
import { useSettingsStore } from '@/stores/settings-store';

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
