import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from 'src/router/routes';
import { normaliseId } from 'src/util';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Normalise system IDs
  Router.beforeEach((to) => {
    if (!to.params.id) {
      return;
    }

    if (Array.isArray(to.params.id)) {
      console.error("params.id is an array somehow, this shouldn't happen wtf");
      return false;
    }

    const normalisedId = normaliseId(to.params.id);
    if (to.params.id !== normalisedId) {
      return {
        ...to,
        params: {
          ...to.params,
          id: normalisedId,
        },
      };
    }
  });

  return Router;
});
