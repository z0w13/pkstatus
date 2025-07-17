import { defineBoot } from '@quasar/app-vite/wrappers';

import PluralKit from 'src/lib/PluralKit/PluralKit';
import ApiClient from 'src/lib/PluralKit/ApiClient';
import { inject } from 'vue';

export const PluralKitSymbol = Symbol('PLURAL_KIT');

export default defineBoot(({ app }) => {
  app.provide(PluralKitSymbol, new PluralKit(new ApiClient()));
});

export function usePluralKit(): PluralKit {
  const pluralKit = inject<PluralKit>(PluralKitSymbol);
  if (!pluralKit) {
    throw Error('usePluralKit: pluralKit is not defined');
  }

  return pluralKit;
}
