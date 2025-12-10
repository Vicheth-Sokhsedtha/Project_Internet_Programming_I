<template>
  <div id="app">
    <!-- S3DStyle Navigation Component -->
    <S3DStyleNavigation :is-logged-in="isLoggedIn" @login="handleLogin" @logout="handleLogout" />

    <!-- Your existing router view -->
    <router-view />

    <!-- Only show signup/login components if NOT logged in -->
    <div v-if="!isLoggedIn" class="app-container">
      <div class="component-wrapper">
        <template v-if="currentPage === 'signup'">
          <SignUpPage
            @switch-page="switchPage"
            @successful-signup="handleSuccessfulSignup"
          />
        </template>

        <template v-else-if="currentPage === 'login'">
          <LoginPage
            @switch-page="switchPage"
            @successful-login="handleSuccessfulLogin"
          />
        </template>
      </div>
    </div>

    <!-- Show welcome message when logged in -->
    <div v-else class="welcome-container">
      <h2>Welcome back! You're now logged in.</h2>
      <p>You can browse products, add items to cart, and checkout.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from './stores/cart';
import LoginPage from './components/LoginPage.vue';
import SignUpPage from './components/SignUpPage.vue';
import S3DStyleNavigation from './components/navigationComponent.vue';

// --- State for tracking the current page ---
const currentPage = ref<'signup' | 'login'>('signup');

// --- Login state - check localStorage on mount ---
const isLoggedIn = ref(false);

// Check if user is already logged in (from localStorage)
onMounted(() => {
  const savedLoginState = localStorage.getItem('isLoggedIn');
  if (savedLoginState === 'true') {
    isLoggedIn.value = true;
  }
});

// --- Function to handle the page switch event from children ---
const switchPage = (page: 'signup' | 'login') => {
  currentPage.value = page;
};

// --- Login/Logout handlers ---
const handleLogin = () => {
  // This is called when user clicks Login button in navigation
  // Switch to login page if not already there
  currentPage.value = 'login';
  console.log('Login button clicked - showing login form');
};

const handleLogout = () => {
  isLoggedIn.value = false;
  localStorage.removeItem('isLoggedIn');
  console.log('User logged out');
  // Switch to signup page after logout
  currentPage.value = 'signup';
};

// --- Successful authentication handlers ---
const handleSuccessfulLogin = () => {
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', 'true');
  console.log('Login successful');
  // You could also redirect to a dashboard or home page here
  // router.push('/dashboard');
};

const handleSuccessfulSignup = () => {
  // After successful signup, switch to login page
  // Or automatically log them in
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', 'true');
  console.log('Signup successful - user auto-logged in');
  // Alternatively, you could just switch to login page:
  // currentPage.value = 'login';
};

// --- Cart store ---
const cartStore = useCartStore();
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.app-container {
  width: 100%;
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.component-wrapper {
  margin-bottom: 40px;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-section-title {
  max-width: 800px;
  margin: 0 auto 20px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.welcome-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-container h2 {
  color: #42b983;
  margin-bottom: 1rem;
}

.welcome-container p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
