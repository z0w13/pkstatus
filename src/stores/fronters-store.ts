import { defineStore } from 'pinia';
import { pk } from 'boot/pkapi';
import { APIError, Member as ApiMember } from 'pkapi.js';

import dayjs from 'dayjs';
import { Member } from 'src/models/Member';

const STORE_NAME = 'fronters';

export interface Fronters {
  allowed: boolean;
  system: string;
  lastUpdated: dayjs.Dayjs;
  lastSwitch: dayjs.Dayjs | null;
  members: Array<Member>;
}

interface State {
  fronters: Record<string, Fronters>;
}

async function getFronters(id: string): Promise<Fronters> {
  const emptyFronters = {
    system: id,
    lastUpdated: dayjs(),
    lastSwitch: null,
    members: [],
  };

  try {
    const fronters = await pk.getFronters({ system: id });
    // Fronters being undefined means a switch has never been registered
    if (!fronters) {
      return {
        ...emptyFronters,
        allowed: true,
      };
    }
    const members = [...(fronters.members?.values() || [])] as Array<ApiMember>;
    return {
      system: id,
      lastUpdated: dayjs(),
      lastSwitch: dayjs(fronters.timestamp),
      members: members.map((m) => Member.fromPKApi(m)),
      allowed: true,
    };
  } catch (e) {
    if (e instanceof APIError && e.status == '403') {
      // System has denied access to fronters, return default/empty data
      return {
        ...emptyFronters,
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
      return Object.values(this.fronters).filter(
        (fronter) =>
          Date.now() - fronter.lastUpdated.valueOf() > timeoutSec * 1000,
      );
    },
    async addFronters(id: string): Promise<Fronters> {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        this.fronters[id] = await getFronters(id);
      }

      return this.fronters[id];
    },
    async updateFronters(id: string): Promise<Fronters> {
      if (!Object.prototype.hasOwnProperty.call(this.fronters, id)) {
        return this.addFronters(id); // TODO: Handle non existent system
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
