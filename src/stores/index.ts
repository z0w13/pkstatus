import { defineStore } from '#q-app';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { usePluralKit } from '@/boot/pluralKit';
import PluralKit from '@/lib/PluralKit/PluralKit';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

declare module 'pinia' {
  export interface PiniaCustomProperties {
    pluralKit: PluralKit;
  }
}

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  pinia.use(({ store }) => {
    store.pluralKit = usePluralKit();
  });

  return pinia;
});
