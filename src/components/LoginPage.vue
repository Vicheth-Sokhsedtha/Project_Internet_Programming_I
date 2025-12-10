<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LoginData } from '../types' // Corrected path: up one level to src/

// Emits
const emit = defineEmits(['switch-page', 'successful-login'])

// --- State for password visibility ---
const passwordVisible = ref(false)

const loginData = ref<LoginData>({
  username: '',
  email: '',
  password: '',
})

const submitted = ref(false)

const isFormValid = computed(() => {
  return (
    loginData.value.username.trim() !== '' &&
    loginData.value.email.trim() !== '' &&
    loginData.value.password.trim() !== ''
  )
})

const handleLogin = () => {
  submitted.value = true

  if (isFormValid.value) {
    console.log('Login Successful:', loginData.value)

    // Emit successful-login event to parent
    emit('successful-login')

    // Clear form
    loginData.value = {
      username: '',
      email: '',
      password: '',
    }
    submitted.value = false
  } else {
    console.error('Login Failed: Please fill in all fields.')
  }
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div class="login-page-container">
    <div class="welcome-section">
      <h2 class="welcome-title">Welcome back!</h2>
      <p class="welcome-text">
        Log in to continue enjoying exclusive offers, rewards, and discounts waiting for you.
      </p>
    </div>

    <div class="form-section">
      <h2 class="form-title">Log In</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <label for="login-username">Username</label>
        <input
          id="login-username"
          v-model="loginData.username"
          type="text"
          placeholder="Enter username"
          :class="{ 'input-error': submitted && loginData.username.trim() === '' }"
        />

        <label for="login-email">Email</label>
        <input
          id="login-email"
          v-model="loginData.email"
          type="email"
          placeholder="Enter email"
          :class="{ 'input-error': submitted && loginData.email.trim() === '' }"
        />

        <label for="login-password">Password</label>
        <div class="password-input-wrapper">
          <input
            id="login-password"
            v-model="loginData.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Enter password"
            :class="{ 'input-error': submitted && loginData.password.trim() === '' }"
          />
          <span
            class="password-toggle"
            @click="togglePasswordVisibility"
            :class="{ 'icon-open': passwordVisible, 'icon-closed': !passwordVisible }"
          ></span>
        </div>

        <p v-if="submitted && !isFormValid" class="error-message">
          ⚠️ Please fill out all required fields.
        </p>

        <button type="submit" class="submit-button">Log In</button>
      </form>

      <p class="signup-link">
        Don't have an account?
        <a href="#" class="link" @click="$emit('switch-page', 'signup')">Sign Up</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Standard Styles (consistent across components) */
.login-page-container {
  display: flex;
  max-width: 800px;
  margin: 40px auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.welcome-section {
  flex: 1;
  padding: 40px;
  background-color: #c9b59c;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 10px;
}

.form-section {
  flex: 1;
  padding: 40px;
}

.form-title {
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.auth-form label {
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 14px;
}

.auth-form input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.input-error {
  border-color: #d9534f !important;
  box-shadow: 0 0 0 1px #d9534f;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Eye Open Icon (Show Password) */
.icon-open {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0a0a0'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z'/%3E%3C/svg%3E");
}

/* Eye Closed Icon (Hide Password) */
.icon-closed {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a0a0a0'%3E%3Cpath d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.72-2.89 3.49-4.8c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16c.57-.23 1.18-.36 1.83-.36zm-8.82 8.82L3 18.28l-1.44-1.44-.73-.73 1.44-1.44 2.37-2.37L1 5.27l1.41-1.41 18.3 18.3-1.41 1.41-4.9-4.9c-1.02.37-2.16.6-3.35.6-5 0-9.27-3.11-11-7.5 1.09-2.72 3.55-4.81 6.38-5.71l-1.42-1.42c-2.88 1.02-5.45 3.1-7.44 5.71L1 12l2.18 2.18zM12 10.15c-.48 0-.91.13-1.29.35l2.49 2.49c.22-.38.35-.81.35-1.29 0-1.38-1.12-2.5-2.5-2.5z'/%3E%3C/svg%3E");
}

.submit-button {
  width: 100%;
  padding: 12px;
  margin-top: 30px;
  background-color: #d4a267;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #c49463;
}

.error-message {
  color: #d9534f;
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}

.signup-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.signup-link .link {
  color: #d8a776;
  text-decoration: none;
  font-weight: 500;
}
</style>
