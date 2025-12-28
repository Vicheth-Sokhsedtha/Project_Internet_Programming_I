<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join S3DStyle and start shopping</p>
        </div>

        <form @submit.prevent="handleSignup" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Create a password"
              required
              minlength="6"
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>

          <label class="checkbox-label terms">
            <input type="checkbox" v-model="agreeToTerms" required />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <button type="submit" class="submit-btn">Create Account</button>

          <div class="divider">
            <span>or</span>
          </div>

          <button type="button" class="social-btn google">
            <span>🔍</span> Sign up with Google
          </button>

          <p class="switch-text">
            Already have an account?
            <router-link to="/login" class="switch-link">Sign in</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const agreeToTerms = ref(false);

const handleSignup = () => {
  // Validation
  if (!formData.value.name || !formData.value.email || !formData.value.password) {
    alert('Please fill in all fields');
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  if (formData.value.password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  if (!agreeToTerms.value) {
    alert('Please agree to the terms and conditions');
    return;
  }

  // Store user data
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userName', formData.value.name);
  localStorage.setItem('userEmail', formData.value.email);

  // Redirect to products page
  router.push('/products');
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px;
  font-family: "Playfair Display", serif;
}

.auth-header p {
  color: #7f8c8d;
  font-size: 16px;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
}

.checkbox-label.terms {
  margin-top: 5px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 87, 108, 0.4);
}

.divider {
  text-align: center;
  position: relative;
  margin: 5px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #f5576c;
  background: #fff5f7;
  transform: translateY(-2px);
}

.social-btn span {
  font-size: 20px;
}

.switch-text {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 5px;
}

.switch-link {
  color: #f5576c;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: #f093fb;
}
</style>
