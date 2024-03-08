import { version } from '../../package.json';
import { boot } from 'quasar/wrappers';
import PluralKitApi from 'src/lib/PluralKitApi';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $pk: PluralKitApi;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const pk = new PluralKitApi();

export default boot(({ app }) => {
  app.config.globalProperties.$pk = pk;
  pk.user_agent = `PKStatus/v${version} https://github.com/z0w13/pkstatus`;
});

export { pk };
