import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue')
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/reset-password',
    component: () => import('pages/ResetPasswordPage.vue')
  },
  {
    path: '/mood',
    component: () => import('pages/MoodSelectorModal.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: 'team',
        component: () => import('pages/TeamPage.vue')
      },
      {
        path: 'peoples',
        component: () => import('pages/UsersPage.vue')
      },
      {
        path: '/user/:id',
        component: () => import('pages/UserProfilePage.vue'),
        meta: { hideSomeElements: true }
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
