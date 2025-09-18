import { ZodError, z } from 'zod';

import { System, SerializedSystem } from 'src/models/System';
import { Fronters, SerializedFronters } from 'src/models/Fronters';
import { Member, SerializedMember } from 'src/models/Member';
import {
  CacheInfo,
  SerializedCacheInfo,
} from 'src/lib/PluralKit/cache/BaseCache';

import SystemCache from 'src/lib/PluralKit/cache/SystemCache';
import MemberCache from 'src/lib/PluralKit/cache/MemberCache';
import FronterCache from 'src/lib/PluralKit/cache/FronterCache';

import { usePluralKit } from 'boot/pluralKit';
import { useSystemStore } from 'src/stores/system-store';

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
type PersistedCache = z.infer<typeof PersistedCache>;

export class CachePersister {
  constructor(
    public systemCache: SystemCache,
    public memberCache: MemberCache,
    public fronterCache: FronterCache,
    public systemStore: ReturnType<typeof useSystemStore>,

    // cache persistence state
    private persistInterval: ReturnType<typeof setInterval> | null = null,
    private trackingCaches = false,
    private cacheDirty = false,
  ) {}

  public start() {
    if (this.persistInterval) {
      console.warn('CachePersister::start | already started, doing nothing');
    }

    if (!this.trackingCaches) {
      this.systemCache.on('change', () => (this.cacheDirty = true));
      this.memberCache.on('change', () => (this.cacheDirty = true));
      this.fronterCache.on('change', () => (this.cacheDirty = true));

      this.trackingCaches = true;
    }

    this.persistInterval = setInterval(() => {
      console.debug('useCachePersister::check', { dirty: this.cacheDirty });
      if (!this.cacheDirty) {
        return;
      }

      this.persist(this.systemStore.ids);
      this.cacheDirty = false;
    }, 10_000);
  }

  public stop() {
    if (this.persistInterval) {
      clearInterval(this.persistInterval);
      this.persistInterval = null;
    }
  }

  public persist(sysIds: Array<string>) {
    console.debug('CachePersister::persist', sysIds);
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
          Fronters.fromStorage(obj, this.memberCache.getMulti(obj.members)),
        ),
      );
      console.info('restored from persisted cache', {
        systems: parsedCache.systems.length,
        members: parsedCache.members.length,
        fronters: parsedCache.fronters.length,
      });
    } catch (e) {
      if (e instanceof ZodError) {
        localStorage.removeItem('persisted-cache');
        return;
      }
    }
  }
}

export default function useCachePersister() {
  const pluralKit = usePluralKit();
  return new CachePersister(
    pluralKit.systemCache,
    pluralKit.memberCache,
    pluralKit.fronterCache,
    useSystemStore(),
  );
}
