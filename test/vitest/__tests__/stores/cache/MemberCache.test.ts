import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import MemberCache from 'src/stores/cache/MemberCache';

function getCache() {
  const pk = new PluralKitApi();
  return new MemberCache(pk);
}

describe('MemberCache', function () {});
