import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Product Catalog Dashboard',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

// Update page title on route change
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'Product Catalog';
});

export default router;
