import { createRouter, createWebHistory } from 'vue-router';
import ProductDetail from '@/views/ProductDetail.vue';
import CartPage from '@/views/CartPage.vue';
import CheckoutCart from '@/views/CheckoutCart.vue';
import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import ProductPage from '../views/ProductPage.vue';
import EndpageView from '../views/EndpageView.vue';
import LoginView from '../views/LoginView.vue';
import SignUpView from '../views/SignUpView.vue';

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
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
