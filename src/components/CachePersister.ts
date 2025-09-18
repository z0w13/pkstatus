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

  return {
    restore: () => persister.restore(),
    track: () => {
      pluralKit.systemCache.on('change', (system) => {
        console.debug('useCachePersister::change', { system });
        if (systemStore.ids.includes(system.id)) {
          persister.persist(systemStore.ids);
        }
      });
      pluralKit.memberCache.on('change', (member) => {
        console.debug('useCachePersister::change', { member });
        if (systemStore.ids.includes(member.system)) {
          persister.persist(systemStore.ids);
        }
      });
      pluralKit.fronterCache.on('change', (fronter) => {
        console.debug('useCachePersister::change', { fronter });
        if (systemStore.ids.includes(fronter.system)) {
          persister.persist(systemStore.ids);
        }
      });
    },
    persister,
  };
}
