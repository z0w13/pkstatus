import { boot } from 'quasar/wrappers';
import PKAPI from 'pkapi.js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $pk: PKAPI;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const pk = new PKAPI();

export default boot(({ app }) => {
  app.config.globalProperties.$pk = pk;
});

export { pk };
