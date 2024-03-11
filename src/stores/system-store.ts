import { StateTree, defineStore } from 'pinia';
import { pk } from 'boot/pkapi';
import { LatestVersion, migrate } from 'src/models/migrations/system/index';
import { System } from 'src/models/System';
import dayjs from 'dayjs';

const STORE_NAME = 'systems';

interface State {
  systems: Record<string, System>;
}

export const useSystemStore = defineStore(STORE_NAME, {
  state: (): State => ({
    systems: {},
  }),
  actions: {
    getOutdated(timeoutSec: number): Array<System> {
      return Object.values(this.systems).filter(
        (system) => Math.abs(system.updatedAt.diff()) > timeoutSec * 1000,
      );
    },
    find(id: string): System | null {
      return this.systems[id] || null;
    },
    async add(id: string): Promise<System> {
      if (Object.prototype.hasOwnProperty.call(this.systems, id)) {
        return this.systems[id];
      }

      const system = await pk.getSystem({ system: id });
      this.systems[system.id] = System.fromPKApi(system);
      return this.systems[id];
    },

    async update(id: string): Promise<System> {
      if (!this.systems[id]) {
        return this.add(id); // TODO: Handle duplicate systems
      }

      this.systems[id] = System.fromDict({
        ...this.systems[id],
        ...System.fromPKApi(await pk.getSystem({ system: id })),

        updatedAt: dayjs(),
      });

      return this.systems[id];
    },

    delete(id: string): void {
      if (!this.systems[id]) {
        return; // TODO: Handle non-existent systems
      }

      delete this.systems[id];
    },
  },

  persist: {
    serializer: {
      serialize: function (value: StateTree): string {
        const systems = Object.values<System>(value.systems);
        return JSON.stringify({
          version: LatestVersion,
          systems: systems.map((s) => s.toStorage()),
        });
      },

      deserialize: function (value: string): State {
        const parsed = migrate(JSON.parse(value));
        return {
          systems: Object.fromEntries(
            parsed.systems.map((s) => [s.id, System.fromStorage(s)]),
          ),
        };
      },
    },
    afterRestore: (ctx) => ctx.store.$persist(),
  },
});
