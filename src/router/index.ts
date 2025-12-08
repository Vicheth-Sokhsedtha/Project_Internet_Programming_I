import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '@/views/ProductDetail.vue';
import CartPage from '@/views/CartPage.vue';
import CheckoutCart from '@/views/CheckoutCart.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
