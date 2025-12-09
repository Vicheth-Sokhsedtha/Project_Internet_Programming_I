// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import SignUpPage from '../components/SignUpPage.vue'
import LoginPage from '../components/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/signup' }, // Default page → Sign Up
    { path: '/signup', component: SignUpPage },
    { path: '/login', component: LoginPage },
  ],
})

export default router
