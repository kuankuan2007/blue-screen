import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import colors from '@/scripts/colors';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/windows10' },
  {
    path: '/windows10',
    component: () => import('@/views/StyleWindows10.vue'),
    meta: { title: 'Windows 10', isStyleView: true, bgColor: colors.windowsNow.value },
  },
  {
    path: '/windows11',
    component: () => import('@/views/StyleWindows11.vue'),
    meta: { title: 'Windows 11', isStyleView: true, bgColor: colors.windowsInsider.value },
  },
  {
    path: '/windows7',
    component: () => import('@/views/StyleWindows7.vue'),
    meta: { title: 'Windows 7', isStyleView: true, bgColor: colors.windowsOld.value },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
