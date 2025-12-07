import { createRouter, createWebHistory } from 'vue-router';
import ProductView from '../views/HomeView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';

const routes = [
  {
    path: '/product',
    name: 'Product',
    component: ProductView
  },

  {
    path: '/cart',
    name: 'Cart',
    component: CartView
  },

  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
