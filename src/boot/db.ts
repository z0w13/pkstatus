import { boot } from 'quasar/wrappers';
import { Database } from 'src/db/Database';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: Database;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const db = new Database();

export default boot(({ app }) => {
  app.config.globalProperties.$db = db;
});

export { db };
