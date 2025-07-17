import { StateTree, defineStore } from 'pinia';

import { LatestVersion, migrate } from 'src/models/migrations/system/index';
import { System } from 'src/models/System';
import { Fronters } from 'src/models/Fronters';

const STORE_NAME = 'systems';

interface State {
  systems: Record<string, boolean>;
}

export const useSystemStore = defineStore(STORE_NAME, {
  state: (): State => ({
    systems: {},
  }),
  getters: {
    ids: (state) => Object.keys(state.systems),
  },
  actions: {
    getExpired(ttl?: number): Array<System> {
      return this.pluralKit.systemCache
        .getExpired(ttl, true)
        .filter((s) => this.systems[s.id]);
    },
    getExpiredFronters(ttl?: number): Array<Fronters> {
      return this.pluralKit.fronterCache
        .getExpired(ttl, true)
        .filter((f) => this.systems[f.system]);
    },
    has(id: string): boolean {
      return this.ids.includes(id);
    },
    async get(id: string): Promise<System> {
      return await this.add(id);
    },
    async getAll(): Promise<ReadonlyArray<System>> {
      return Promise.all(this.ids.map((id) => this.pluralKit.getSystem(id)));
    },

    async add(id: string): Promise<System> {
      const system = await this.pluralKit.getSystem(id);

      this.systems[system.id] = true;
      return system;
    },
    async update(id: string): Promise<System> {
      return await this.pluralKit.getSystem(id, { skipCache: true });
    },
    delete(id: string): void {
      delete this.systems[id];
    },
  },
  persist: {
    serializer: {
      serialize: function (value: StateTree): string {
        return JSON.stringify({
          version: LatestVersion,
          systems: Object.keys(value.systems),
        });
      },

      deserialize: function (value: string): State {
        const parsed = migrate(JSON.parse(value));
        return {
          systems: Object.fromEntries(parsed.systems.map((s) => [s, true])),
        };
      },
    },
    afterHydrate: (ctx) => ctx.store.$persist(),
  },
});
