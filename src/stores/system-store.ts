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
    getOutdated(timeoutSec: number): Array<ExtendedSystem> {
      return Object.values(this.systems).filter(
        (system) => Date.now() - system.lastUpdated > timeoutSec * 1000,
      );
    },
    getSystem(id: string): ExtendedSystem | null {
      return this.systems[id] || null;
    },
    async addSystem(id: string): Promise<ExtendedSystem> {
      if (Object.prototype.hasOwnProperty.call(this.systems, id)) {
        return this.systems[id]; // TODO: Handle duplicate systems
      }

      const system = await pk.getSystem({ system: id });
      this.systems[system.id] = {
        ...system,

        note: '',
        lastUpdated: Date.now(),
      };
      return this.systems[id];
    },

    async updateSystem(id: string): Promise<ExtendedSystem> {
      if (!this.systems[id]) {
        return this.addSystem(id); // TODO: Handle duplicate systems
      }

      this.systems[id] = {
        ...this.systems[id],
        ...(await pk.getSystem({ system: id })),
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
