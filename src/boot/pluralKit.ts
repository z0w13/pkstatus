import { defineBoot } from '#q-app';
import { StrictTypedClient } from 'pkapi-ts';

import PluralKit from '@/lib/PluralKit/PluralKit';

let pluralKitInstance: PluralKit | undefined;

export default defineBoot(() => {
  pluralKitInstance = new PluralKit(new StrictTypedClient());
});

export function usePluralKit(): PluralKit {
  if (!pluralKitInstance) {
    throw Error('usePluralKit: pluralKit is not defined');
  }

  return pluralKitInstance;
}
