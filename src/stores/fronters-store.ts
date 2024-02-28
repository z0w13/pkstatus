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
  try {
    const fronters = await pk.getFronters({ system: id });
    const members = [...(fronters.members?.values() || [])] as Array<ApiMember>;

    return {
      system: id,
      lastUpdated: dayjs(),
      lastSwitch: dayjs(fronters.timestamp),
      members: members.map((m) => Member.fromPKApi(m)),
      allowed: true,
    };
  } catch (e) {
    const emptyFronters = {
      system: id,
      lastUpdated: dayjs(),
      lastSwitch: null,
      members: [],
    };

    if (e instanceof APIError && e.status == '403') {
      // System has denied access to fronters, return default/empty data
      return {
        ...emptyFronters,
        allowed: false,
      };
    } else if (e instanceof TypeError) {
      // No switches have been registered, but pkapi.js doesn't handle this
      // return default/empty status, we're catching all TypeErrors
      // which is a bit broad but it'll do for now
      return {
        ...emptyFronters,
        allowed: true,
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
