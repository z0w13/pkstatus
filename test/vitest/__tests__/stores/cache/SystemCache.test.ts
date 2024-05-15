import { describe, expect, it } from 'vitest';

import PluralKitApi from 'src/lib/PluralKitApi';
import SystemCache from 'src/stores/cache/SystemCache';

function getCache() {
  const pk = new PluralKitApi();
  return new SystemCache(pk);
}

describe('SystemCache', function () {});
