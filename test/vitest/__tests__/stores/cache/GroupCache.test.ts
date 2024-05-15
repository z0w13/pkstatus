import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import GroupCache from 'src/stores/cache/GroupCache';

function getCache() {
  const pk = new PluralKitApi();
  return new GroupCache(pk);
}

describe('GroupCache', function () {});
