import { defineStore } from 'pinia';

import SystemCache from 'src/stores/cache/SystemCache';
import MemberCache from 'src/stores/cache/MemberCache';
import FronterCache from 'src/stores/cache/FronterCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';
import PluralKitWrapper from 'src/lib/PluralKitWrapper';
import { pk } from 'src/boot/pkapi';

const STORE_NAME = 'cache';

export const useCacheStore = defineStore(STORE_NAME, {
  state: () => {
    const systemCache = new SystemCache();
    const memberCache = new MemberCache();
    const systemMemberCache = new SystemMemberCache(memberCache);
    const fronterCache = new FronterCache(memberCache);
    const pluralKit = new PluralKitWrapper(
      pk,
      systemCache,
      memberCache,
      fronterCache,
      systemMemberCache,
    );

    return {
      pluralKit,
      systemCache,
      memberCache,
      systemMemberCache,
      fronterCache,
    };
  },
});
