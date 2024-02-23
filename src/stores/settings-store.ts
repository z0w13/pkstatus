import { defineStore } from 'pinia';

const STORE_NAME = 'settings';

export interface Settings {
  status: {
    tile: {
      showSystemDescription: boolean;
      showFronterDescription: boolean;
      showUpdateTime: boolean;
      showLastSwitch: boolean;
      tileSize: number;
    };
    table: {
      showUpdateTime: boolean;
      showLastSwitch: boolean;
      iconSize: number;
    };
    list: {
      showUpdateTime: boolean;
      showLastSwitch: boolean;
      iconSize: number;
    };
  };
  dark: boolean;
}

export const useSettingsStore = defineStore(STORE_NAME, {
  state: (): Settings => ({
    status: {
      tile: {
        showSystemDescription: false,
        showFronterDescription: false,
        showUpdateTime: false,
        showLastSwitch: false,
        tileSize: 250,
      },
      table: {
        showUpdateTime: false,
        showLastSwitch: false,
        iconSize: 24,
      },
      list: {
        showUpdateTime: false,
        showLastSwitch: false,
        iconSize: 24,
      },
    },
    dark: false,
  }),
  actions: {},

  persist: true,
});
