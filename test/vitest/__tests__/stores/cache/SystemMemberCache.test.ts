import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import MemberCache from 'src/stores/cache/MemberCache';
import SystemMemberCache from 'src/stores/cache/SystemMemberCache';

function getCache() {
  const pk = new PluralKitApi();
  return new SystemMemberCache(new MemberCache(pk), pk);
}

describe('SystemMemberCache', function () {});
