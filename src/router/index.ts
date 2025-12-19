import { createRouter, createWebHistory } from "vue-router";
import ProductPage from "../views/ProductPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: ProductPage },       // 👈 DEFAULT PAGE
    { path: "/product", component: ProductPage } // 👈 OPTIONAL
  ]
});

export default router;
