import { defineStore } from 'pinia';
import { pk } from 'boot/pkapi';
import { ISystem } from 'pkapi.js';

const STORE_NAME = 'systems';

export interface ExtendedSystem extends ISystem {
  note: string;
  lastUpdated: number;
}

interface State {
  systems: Record<string, ExtendedSystem>;
}

export const useSystemStore = defineStore(STORE_NAME, {
  state: (): State => ({
    systems: {},
  }),
  actions: {
    getSystem(id: string): ExtendedSystem | null {
      return this.systems[id] || null;
    },
    async addSystem(id: string): Promise<ExtendedSystem> {
      if (Object.prototype.hasOwnProperty.call(this.systems, id)) {
        return this.systems[id]; // TODO: Handle duplicate systems
      }

      this.systems[id] = {
        ...(await pk.getSystem({ system: id })),
        note: '',
        lastUpdated: Date.now(),
      };
      return this.systems[id];
    },
    deleteSystem(id: string): void {
      if (!Object.prototype.hasOwnProperty.call(this.systems, id)) {
        return; // TODO: Handle non-existent systems
      }

      delete this.systems[id];
    },
  },

  persist: true,
});
