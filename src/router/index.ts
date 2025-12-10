import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '@/views/ProductDetail.vue';
import CartPage from '@/views/CartPage.vue';
import CheckoutCart from '@/views/CheckoutCart.vue';
import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'ProductDetail',
    component: ProductDetail
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutCart
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
