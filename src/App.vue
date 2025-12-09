<script setup lang="ts">
import { ref } from 'vue'
// Corrected paths for components inside the 'components' folder
import LoginPage from './components/LoginPage.vue'
import SignUpPage from './components/SignUpPage.vue'

// --- State for tracking the current page ---
// 'signup' will be the initial page
const currentPage = ref<'signup' | 'login'>('signup')

// --- Function to handle the page switch event from children ---
const switchPage = (page: 'signup' | 'login') => {
  currentPage.value = page
}
</script>

<template>
  <div class="app-container">
    <div class="component-wrapper">
      <template v-if="currentPage === 'signup'">
        <SignUpPage @switch-page="switchPage" />
      </template>

      <template v-else-if="currentPage === 'login'">
        <LoginPage @switch-page="switchPage" />
      </template>
    </div>
  </div>
</template>

<style>
/* Global/App Styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  padding: 20px 0;
}

.component-wrapper {
  margin-bottom: 40px;
}

.page-section-title {
  max-width: 800px;
  margin: 0 auto 10px;
  font-size: 20px;
  font-weight: 400;
  color: #333;
}
</style>
