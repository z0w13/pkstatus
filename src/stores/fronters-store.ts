import { defineStore } from 'pinia';
import { pk } from 'boot/pkapi';
import { APIError, Member } from 'pkapi.js';

const STORE_NAME = 'fronters';

export interface Fronters {
  allowed: boolean;
  system: string;
  lastUpdated: number;
  members: Array<Member>;
}

interface State {
  fronters: Record<string, Fronters>;
}

async function getFronters(id: string): Promise<Fronters> {
  try {
    const fronters = await pk.getFronters({ system: id });
    const members = [...(fronters.members?.values() || [])] as Array<Member>;

    return {
      system: id,
      lastUpdated: Date.now(),
      members,
      allowed: true,
    };
  } catch (e) {
    if (e instanceof APIError && e.status == '403') {
      return {
        system: id,
        lastUpdated: Date.now(),
        members: [],
        allowed: false,
      };
    }

    throw e;
  }
}

export const useFrontersStore = defineStore(STORE_NAME, {
  state: (): State => ({
    fronters: {},
  }),
  actions: {
    getFronters(id: string): Fronters | null {
      return this.fronters[id] || null;
    },
    getOutdated(timeoutSec: number): Array<Fronters> {
      return Object.values(this.fronters).filter((fronter) => {
        Date.now() - fronter.lastUpdated > timeoutSec * 1000
      })
    },
    async addFronters(id: string): Promise<Fronters> {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        this.fronters[id] = await getFronters(id);
      }

      return this.fronters[id];
    },
    async updateFronters(id: string): Promise<Fronters> {
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
