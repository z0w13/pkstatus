import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/status' },
      {
        path: '/status',
        component: () => import('pages/StatusPage.vue'),
        children: [
          { path: '/status', redirect: '/status/tile' },
          {
            path: '/status/tile',
            component: () => import('pages/status/TileLayout.vue'),
          },
          {
            path: '/status/list',
            component: () => import('pages/status/ListLayout.vue'),
          },
          {
            path: '/status/table',
            component: () => import('pages/status/TableLayout.vue'),
          },
        ],
      },
      { path: '/manage', component: () => import('pages/ManagePage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
