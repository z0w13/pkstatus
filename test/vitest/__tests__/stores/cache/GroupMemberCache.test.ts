import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import GroupMemberCache from 'src/stores/cache/GroupMemberCache';
import MemberCache from 'src/stores/cache/MemberCache';
import GroupCache from 'src/stores/cache/GroupCache';

function getCache() {
  const pk = new PluralKitApi();
  return new GroupMemberCache(new MemberCache(pk), new GroupCache(pk), pk);
}

describe('GroupMemberCache', function () {});
