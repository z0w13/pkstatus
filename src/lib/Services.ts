import SystemCache from 'src/stores/cache/SystemCache';
import MemberCache from 'src/stores/cache/MemberCache';
import FronterCache from 'src/stores/cache/FronterCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';
import PluralKitWrapper from 'src/lib/PluralKitWrapper';
import { pk } from 'src/boot/pkapi';

class ServiceStore {
  private static instance: ServiceStore;

  public systemCache: SystemCache;
  public memberCache: MemberCache;
  public systemMemberCache: SystemMemberCache;
  public fronterCache: FronterCache;
  public pluralKit: PluralKitWrapper;

  private constructor() {
    this.systemCache = new SystemCache();
    this.memberCache = new MemberCache();
    this.systemMemberCache = new SystemMemberCache(this.memberCache);
    this.fronterCache = new FronterCache(this.memberCache);
    this.pluralKit = new PluralKitWrapper(
      pk,
      this.systemCache,
      this.memberCache,
      this.fronterCache,
      this.systemMemberCache,
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
