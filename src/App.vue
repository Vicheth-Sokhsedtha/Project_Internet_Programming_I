<template>
  <div id="app">
    <S3DStyleNavigation
      :is-logged-in="isLoggedIn"
      @logout="handleLogout"
    />

    <router-view />
    <EndpageView/>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import S3DStyleNavigation from './components/navigationComponent.vue';
import EndpageView from './views/EndpageView.vue';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);

// Check login status on mount
onMounted(() => {
  checkLoginStatus();
});

// Watch for route changes to update login status
watch(() => route.path, () => {
  checkLoginStatus();
});

const checkLoginStatus = () => {
  const loginState = localStorage.getItem('isLoggedIn');
  isLoggedIn.value = loginState === 'true';
};

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  isLoggedIn.value = false;
  router.push({ name: 'login' }); // redirect to login page
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: #f8f9fa;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
html {
  scroll-behavior: smooth;
}

</style>
