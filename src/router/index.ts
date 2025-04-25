import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import StyleWindows10 from '@/views/StyleWindows10.vue';
import StyleWindows11 from '@/views/StyleWindows11.vue';
import StyleWindows7 from '@/views/StyleWindows7.vue';

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/windows10' },
  {
    path: '/windows10',
    component: StyleWindows10,
    meta: { title: 'Windows 10', isStyleView: true },
  },
  {
    path: '/windows11',
    component: StyleWindows11,
    meta: { title: 'Windows 11', isStyleView: true },
  },
  {
    path: '/windows7',
    component: StyleWindows7,
    meta: { title: 'Windows 7', isStyleView: true },
  },
];
export const router = createRouter({
  history: createWebHistory(),
  routes,
});

