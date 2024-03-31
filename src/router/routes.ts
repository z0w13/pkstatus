import { RouteRecordRaw } from 'vue-router';
import { useSettingsStore } from 'src/stores/settings-store';

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
          {
            path: '/status',
            redirect: () => {
              return {
                path: `/status/${useSettingsStore().status.lastLayout}`,
              };
            },
          },
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
      { path: '/switch', component: () => import('pages/SwitchPage.vue') },
      {
        path: '/lookup',
        component: () => import('pages/Lookup/IndexPage.vue'),
        children: [
          {
            path: '/lookup/system/:id',
            component: () => import('pages/Lookup/SystemPage.vue'),
          },
          {
            path: '/lookup/member/:id',
            component: () => import('pages/Lookup/MemberPage.vue'),
          },
        ],
      },
      {
        path: '/manage',
        children: [
          {
            path: '',
            component: () => import('pages/Manage/ManagePage.vue'),
          },
          {
            path: '/manage/add',
            component: () => import('pages/Manage/AddPage.vue'),
          },
        ],
      },
      { path: '/settings', component: () => import('pages/SettingsPage.vue') },
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
