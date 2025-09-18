import { CachePersister } from 'src/lib/CachePersister';
import { usePluralKit } from 'boot/pluralKit';
import { useSystemStore } from 'src/stores/system-store';

export default function useCachePersister() {
  const pluralKit = usePluralKit();
  const systemStore = useSystemStore();
  const persister = new CachePersister(
    pluralKit.systemCache,
    pluralKit.memberCache,
    pluralKit.fronterCache,
  );

  let persisterInterval: ReturnType<typeof setInterval> | null = null;
  return {
    start: () => {
      if (persisterInterval) {
        console.warn('cache persister already started, doing nothing');
      }
      persister.restore();

      let cacheDirty = false;
      pluralKit.systemCache.on('change', (system) => {
        console.debug('useCachePersister::change', { system });
        if (systemStore.ids.includes(system.id)) {
          cacheDirty = true;
        }
      });
      pluralKit.memberCache.on('change', (member) => {
        console.debug('useCachePersister::change', { member });
        if (systemStore.ids.includes(member.system)) {
          cacheDirty = true;
        }
      });
      pluralKit.fronterCache.on('change', (fronter) => {
        console.debug('useCachePersister::change', { fronter });
        if (systemStore.ids.includes(fronter.system)) {
          cacheDirty = true;
        }
      });

      // only persist every 10 seconds and only if something changed
      persisterInterval = setInterval(() => {
        console.debug('useCachePersister::check', { cacheDirty });
        if (!cacheDirty) {
          return;
        }

        persister.persist(systemStore.ids);
        cacheDirty = false;
      }, 10_000);
    },
    stop: () => {
      if (persisterInterval) {
        clearInterval(persisterInterval);
        persisterInterval = null;
      }
    },
    persister,
  };
}
