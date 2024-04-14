import { defineStore } from 'pinia';

const STORE_NAME = 'log';

interface State {
  lines: Array<{ time: number; message: string }>;
}

export const useLogStore = defineStore(STORE_NAME, {
  state: (): State => ({
    lines: [],
  }),
  actions: {
    log(message: string) {
      while (this.lines.length > 50) {
        this.lines.shift();
      }
      this.lines.push({ time: new Date().valueOf(), message });
    },
  },
  persist: true,
});
