import { defineBoot } from '@quasar/app-vite/wrappers';

import PluralKit from 'src/lib/PluralKit/PluralKit';
import ApiClient from 'src/lib/PluralKit/ApiClient';

let pluralKitInstance: PluralKit | undefined;

export default defineBoot(() => {
  pluralKitInstance = new PluralKit(new ApiClient());
});

export function usePluralKit(): PluralKit {
  if (!pluralKitInstance) {
    throw Error('usePluralKit: pluralKit is not defined');
  }

  return pluralKitInstance;
}
