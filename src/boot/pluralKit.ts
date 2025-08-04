import { defineBoot } from '@quasar/app-vite/wrappers';
import { StrictTypedClient } from 'pkapi-ts';

import PluralKit from 'src/lib/PluralKit/PluralKit';

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
