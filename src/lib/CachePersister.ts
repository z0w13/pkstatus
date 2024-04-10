import { ZodError, z } from 'zod';

import { System, SerializedSystem } from 'src/models/System';
import { Fronters, SerializedFronters } from 'src/models/Fronters';
import { Member, SerializedMember } from 'src/models/Member';
import { CacheInfo, SerializedCacheInfo } from 'src/stores/cache/BaseCache';
import SystemCache from 'src/stores/cache/SystemCache';
import MemberCache from 'src/stores/cache/MemberCache';
import FronterCache from 'src/stores/cache/FronterCache';

const PersistedCache = z.object({
  systems: z.array(
    z.object({ info: SerializedCacheInfo, obj: SerializedSystem }),
  ),
  fronters: z.array(
    z.object({ info: SerializedCacheInfo, obj: SerializedFronters }),
  ),
  members: z.array(
    z.object({ info: SerializedCacheInfo, obj: SerializedMember }),
  ),
});

// NOTE: Disabled because somehow we get a false positive for a non-exported
//       const + type combo
// eslint-disable-next-line no-redeclare
type PersistedCache = z.infer<typeof PersistedCache>;

export class CachePersister {
  constructor(
    public systemCache: SystemCache,
    public memberCache: MemberCache,
    public fronterCache: FronterCache,
  ) {}

  public persist(sysIds: Array<string>) {
    const cacheData: PersistedCache = {
      systems: this.systemCache
        .persist((s) => sysIds.includes(s.id))
        .map(({ info, obj }) => ({
          info: info.toStorage(),
          obj: obj.toStorage(),
        })),
      fronters: this.fronterCache
        .persist((f) => sysIds.includes(f.system))
        .map(({ info, obj }) => ({
          info: info.toStorage(),
          obj: obj.toStorage(),
        })),
      members: this.memberCache
        .persist((m) => sysIds.includes(m.system))
        .map(({ info, obj }) => ({
          info: info.toStorage(),
          obj: obj.toStorage(),
        })),
    };

    localStorage.setItem('persisted-cache', JSON.stringify(cacheData));
  }

  public restore() {
    const persistedCache = localStorage.getItem('persisted-cache');
    if (!persistedCache) {
      return;
    }

    try {
      const parsedCache = PersistedCache.parse(JSON.parse(persistedCache));
      parsedCache.systems.forEach(({ info, obj }) =>
        this.systemCache.setCached(
          CacheInfo.fromStorage(info),
          System.fromStorage(obj),
        ),
      );

      parsedCache.members.forEach(({ info, obj }) =>
        this.memberCache.setCached(
          CacheInfo.fromStorage(info),
          Member.fromStorage(obj),
        ),
      );

      parsedCache.fronters.forEach(({ info, obj }) =>
        this.fronterCache.setCached(
          CacheInfo.fromStorage(info),
          Fronters.fromStorage(
            obj,
            this.memberCache.getMultiCached(obj.members),
          ),
        ),
      );
    } catch (e) {
      if (e instanceof ZodError) {
        localStorage.removeItem('persisted-cache');
        return;
      }
    }
  }
}
