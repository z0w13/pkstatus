import { CachePersister } from 'src/lib/CachePersister';
import { useServices } from 'src/lib/Services';
import { useSystemStore } from 'src/stores/system-store';

export default function useCachePersister() {
  const { fronterCache, systemCache, memberCache } = useServices();
  const systemStore = useSystemStore();
  const persister = new CachePersister(systemCache, memberCache, fronterCache);

  systemCache.on('change', (system) => {
    if (systemStore.ids.includes(system.id)) {
      persister.persist(systemStore.ids);
    }
  });
  memberCache.on('change', (member) => {
    if (systemStore.ids.includes(member.system)) {
      persister.persist(systemStore.ids);
    }
  });
  fronterCache.on('change', (fronter) => {
    if (systemStore.ids.includes(fronter.system)) {
      persister.persist(systemStore.ids);
    }
  });

  return persister;
}
