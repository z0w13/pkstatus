import { defineStore } from 'pinia';
import { pk } from 'boot/pkapi';
import { ISwitch } from 'pkapi.js';

const STORE_NAME = 'fronters';

export interface ExtendedSwitch extends ISwitch {
  allowed: boolean;
  system: string;
  lastUpdated: number;
}

interface State {
  fronters: Record<string, ExtendedSwitch>;
}

async function getFronters(id: string): Promise<ExtendedSwitch> {
  const base = {
    allowed: true,
    system: id,
    lastUpdated: Date.now(),
  };

  try {
    return {
      ...base,
      ...(await pk.getFronters({ system: id })),
    };
  } catch (e) {
    console.error(e);
    return {
      ...base,
      allowed: false,
    };
  }
}

export const useFrontersStore = defineStore(STORE_NAME, {
  state: (): State => ({
    fronters: {},
  }),
  actions: {
    getFronters(id: string): ExtendedSwitch | null {
      return this.fronters[id] || null;
    },
    async addFronters(id: string): Promise<ExtendedSwitch> {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        this.fronters[id] = await getFronters(id);
      }

      return this.fronters[id];
    },
    async updateFronters(id: string): Promise<ExtendedSwitch> {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        return this.addFronters(id); // TODO: Handle non existant system
      }

      this.fronters[id] = {
        ...this.fronters[id],
        ...(await getFronters(id)),
      };
      return this.fronters[id];
    },
    deleteFronters(id: string): void {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        return; // TODO: Handle non-existent fronters
      }

      delete this.fronters[id];
    },
  },
});
