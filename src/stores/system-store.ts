import { StateTree, defineStore } from 'pinia';

import { LatestVersion, migrate } from 'src/models/migrations/system/index';
import { System } from 'src/models/System';
import { useServices } from 'src/lib/Services';

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
    getExpired(): Array<System> {
      const { systemCache } = useServices();
      return systemCache.getExpired().filter((s) => this.systems[s.id]);
    },
    async get(id: string): Promise<System> {
      return await this.add(id);
    },
    async getAll(): Promise<Array<System>> {
      const { systemCache } = useServices();
      return await systemCache.getMulti(this.ids);
    },

    async add(id: string): Promise<System> {
      const { systemCache } = useServices();
      const system = await systemCache.get(id);

      this.systems[system.id] = true;
      return system;
    },
    async update(id: string): Promise<System> {
      const { systemCache } = useServices();
      return await systemCache.fetch(id);
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
    afterRestore: (ctx) => ctx.store.$persist(),
  },
});
