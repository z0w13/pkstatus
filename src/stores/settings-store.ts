import { StateTree, defineStore } from 'pinia';
import { Settings, defaultSettings } from 'src/models/Settings';
import { LatestVersion, migrate } from 'src/models/migrations/settings';

const STORE_NAME = 'settings';

export const useSettingsStore = defineStore(STORE_NAME, {
  state: (): Settings => defaultSettings(),
  actions: {},

  persist: {
    serializer: {
      serialize: function (value: StateTree): string {
        return JSON.stringify({
          version: LatestVersion,
          settings: value,
        });
      },

      deserialize: function (value: string): Settings {
        return Settings.parse(migrate(JSON.parse(value)).settings);
      },
    },
    afterRestore: (ctx) => ctx.store.$persist(),
  },
});
