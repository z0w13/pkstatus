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
        name: 'lookup',
        component: () => import('pages/Lookup/IndexPage.vue'),
        children: [
          {
            path: '/lookup/system/:id',
            component: () => import('pages/Lookup/System/IndexPage.vue'),
            name: 'lookup-system',
            children: [
              {
                path: '/lookup/system/:id',
                redirect: (to) => ({
                  name: 'lookup-system-fronters',
                  params: { id: to.params.id },
                }),
              },
              {
                path: '/lookup/system/:id/fronters',
                component: () =>
                  import('pages/Lookup/System/View/FronterView.vue'),
                name: 'lookup-system-fronters',
              },
              {
                path: '/lookup/system/:id/members',
                component: () =>
                  import('pages/Lookup/System/View/MemberView.vue'),
                name: 'lookup-system-members',
              },
              {
                path: '/lookup/system/:id/groups',
                component: () =>
                  import('pages/Lookup/System/View/GroupView.vue'),
                name: 'lookup-system-groups',
              },
            ],
          },
          {
            path: '/lookup/member/:id',
            component: () => import('pages/Lookup/MemberPage.vue'),
          },
          {
            path: '/lookup/group/:id',
            component: () => import('pages/Lookup/GroupPage.vue'),
          },
        ],
      },
      {
        path: '/switches',
        component: () => import('pages/Switch/IndexPage.vue'),
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
      { path: '/debug', component: () => import('pages/DebugPage.vue') },
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
