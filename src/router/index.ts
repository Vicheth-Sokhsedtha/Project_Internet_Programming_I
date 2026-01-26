import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '@/views/ProductDetail.vue';
import CartPage from '@/views/CartPage.vue';
import CheckoutCart from '@/views/CheckoutCart.vue';
import MyOrdersPage from '@/views/MyOrdersPage.vue';
import AdminOrdersPage from '@/views/AdminOrdersPage.vue';
import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import ProductPage from '../views/ProductPage.vue';
import EndpageView from '../views/EndpageView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import ContactView from '../views/ContactView.vue';
import UserDashboard from '../views/user/UserDashboard.vue';

const routes = [
  {
    path: '/',
    redirect: { name: 'login' } // avoid duplicate name on root
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutCart
  },
  {
    path: '/my-orders',
    name: 'myOrders',
    component: MyOrdersPage
  },
  {
    path: '/admin-orders',
    name: 'adminOrders',
    component: AdminOrdersPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },

  { path: '/product',
    name:'product',
    component: ProductPage
  },

  {
  path: '/product/:id',
  name: 'ProductDetail',
  component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/footer',
    name: '/footer',
    component: EndpageView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },

  {
  path: '/home',
  component: HomeView,
  children: [
    { path: 'about', component: AboutView },
    { path: 'contact', component: EndpageView }
  ]
},
{
  path: "/adminDashboard",
  name: "adminDashboard",
  component: () => import("../views/admin/AdminDashboard.vue"),
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/user/dashboard',
  name: 'userDashboard',
  component: UserDashboard
},
{
  path: '/contact',
  name: 'contact',
  component: ContactView
}





];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// In router/index.js, after creating router
router.beforeEach((to, from, next) => {
  // Check if route requires auth
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      // Not logged in, redirect to login
      next('/login');
      return;
    }

    // Check if route requires admin
    if (to.meta.requiresAdmin && user.role !== 'admin') {
      // Not an admin, redirect to home or user dashboard
      next('/user/dashboard');
      return;
    }
  }

  next();
});

export default router;
