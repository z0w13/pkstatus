import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import SystemGroupCache from 'src/stores/cache/SystemGroupCache';
import GroupCache from 'src/stores/cache/GroupCache';

function getCache() {
  const pk = new PluralKitApi();
  return new SystemGroupCache(new GroupCache(pk), pk);
}

describe('SystemGroupCache', function () {});
