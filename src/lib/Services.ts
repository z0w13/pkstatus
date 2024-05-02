import SystemCache from 'src/stores/cache/SystemCache';
import MemberCache from 'src/stores/cache/MemberCache';
import FronterCache from 'src/stores/cache/FronterCache';
import GroupCache from 'src/stores/cache/GroupCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';
import PluralKitWrapper from 'src/lib/PluralKitWrapper';
import PluralKitApi from './PluralKitApi';
import SystemGroupCache from 'src/stores/cache/SystemGroupCache';
import GroupMemberCache from 'src/stores/cache/GroupMemberCache';

class ServiceStore {
  private static instance: ServiceStore;

  public systemCache: SystemCache;
  public memberCache: MemberCache;
  public systemMemberCache: SystemMemberCache;
  public groupCache: GroupCache;
  public groupMemberCache: GroupMemberCache;
  public systemGroupCache: SystemGroupCache;
  public fronterCache: FronterCache;
  public pluralKit: PluralKitWrapper;

  private constructor() {
    const pk = new PluralKitApi();
    this.systemCache = new SystemCache(pk);
    this.memberCache = new MemberCache(pk);
    this.systemMemberCache = new SystemMemberCache(this.memberCache, pk);
    this.groupCache = new GroupCache(pk);
    this.groupMemberCache = new GroupMemberCache(
      this.memberCache,
      this.groupCache,
      pk,
    );
    this.systemGroupCache = new SystemGroupCache(this.groupCache, pk);
    this.fronterCache = new FronterCache(this.memberCache, pk);
    this.pluralKit = new PluralKitWrapper(
      pk,
      this.systemCache,
      this.memberCache,
      this.systemMemberCache,
      this.groupCache,
      this.groupMemberCache,
      this.systemGroupCache,
      this.fronterCache,
    );
  }

  public static getInstance(): ServiceStore {
    if (!ServiceStore.instance) {
      ServiceStore.instance = new ServiceStore();
    }

    return ServiceStore.instance;
  }
}

export function useServices(): ServiceStore {
  return ServiceStore.getInstance();
}
