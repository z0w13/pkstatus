import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import PluralKitWrapper from 'src/lib/PluralKitWrapper';
import FronterCache from 'src/stores/cache/FronterCache';
import GroupCache from 'src/stores/cache/GroupCache';
import GroupMemberCache from 'src/stores/cache/GroupMemberCache';
import MemberCache from 'src/stores/cache/MemberCache';
import SystemCache from 'src/stores/cache/SystemCache';
import SystemGroupCache from 'src/stores/cache/SystemGroupCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';

function getWrapper() {
  const pk = new PluralKitApi();

  const systemCache = new SystemCache(pk);
  const memberCache = new MemberCache(pk);
  const groupCache = new GroupCache(pk);

  return new PluralKitWrapper(
    pk,
    systemCache,
    memberCache,
    new SystemMemberCache(memberCache, pk),
    groupCache,
    new GroupMemberCache(memberCache, groupCache, pk),
    new SystemGroupCache(groupCache, pk),
    new FronterCache(memberCache, pk),
  );
}

describe('PluralKitWrapper', function () {});
