import PluralKitApi from 'src/lib/PluralKitApi';
import FronterCache from 'src/stores/cache/FronterCache';
import MemberCache from 'src/stores/cache/MemberCache';
import { describe, expect, it } from 'vitest';

function getCache() {
  const pk = new PluralKitApi();
  return new FronterCache(new MemberCache(pk), pk);
}

describe('FronterCache', function () {});
