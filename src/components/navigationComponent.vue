<template>
  <nav class="s3dstyle-nav">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <div class="nav-brand">
        <router-link to="/" class="logo-link">
          <span class="logo">S3DStyle</span>
        </router-link>
      </div>

      <!-- Desktop Navigation Links -->
      <div class="nav-menu">
        <ul class="nav-links">
          <li class="nav-item">
            <router-link to="/home" class="nav-link" active-class="active">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              Product
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link" active-class="active">
              Contact
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Right side actions -->
      <div class="nav-actions">
        <!-- Cart with count -->
        <div class="cart-container">
          <router-link to="/cart" class="cart-link">
            <span class="cart-icon">🛒</span>
            <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
          </router-link>
        </div>

        <!-- Checkout link -->
        <router-link to="/checkout" class="checkout-link">
          Checkout
        </router-link>

        <!-- Login/Logout button -->
        <button class="login-btn" @click="handleAuthClick">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </button>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-toggle" @click="toggleMobileMenu">
          <span class="hamburger" :class="{ 'active': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <ul class="mobile-nav-links">
          <li class="mobile-nav-item">
            <router-link to="/home" class="mobile-nav-link" @click="closeMobileMenu" active-class="active">
              Home
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu" active-class="active">
              Product
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu" active-class="active">
              About
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu" active-class="active">
              Contact
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/cart" class="mobile-nav-link" @click="closeMobileMenu">
              Cart ({{ cartItemCount }})
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <router-link to="/checkout" class="mobile-nav-link" @click="closeMobileMenu">
              Checkout
            </router-link>
          </li>
          <li class="mobile-nav-item">
            <button class="mobile-auth-btn" @click="handleMobileAuth">
              {{ isLoggedIn ? 'Logout' : 'Login' }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart';

// Props
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['login', 'logout']);

// State
const mobileMenuOpen = ref(false);

// Cart store
const cartStore = useCartStore();

// Computed
const cartItemCount = computed(() => cartStore.itemCount);

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleAuthClick = () => {
  if (props.isLoggedIn) {
    emit('logout');
  } else {
    emit('login');
  }
  closeMobileMenu();
};

const handleMobileAuth = () => {
  handleAuthClick();
  closeMobileMenu();
};
</script>

<style scoped>
.s3dstyle-nav {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0.5rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
}

/* Brand */
.nav-brand .logo-link {
  text-decoration: none;
}

.nav-brand .logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  letter-spacing: 1px;
}

/* Desktop Navigation */
.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
}

.nav-item .nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-item .nav-link:hover {
  color: #007bff;
}

.nav-item .nav-link.active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}

/* Right side actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-container {
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4757;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkout-link:hover {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.login-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #3aa876;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #333;
  transition: all 0.3s ease;
  transform-origin: left center;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-top: 1px solid #eee;
}

.mobile-menu.active {
  display: block;
}

.mobile-nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  margin-bottom: 0.8rem;
}

.mobile-nav-link {
  display: block;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
}

.mobile-nav-link.active {
  color: #42b983;
}

.mobile-auth-btn {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .nav-actions .checkout-link,
  .nav-actions .login-btn {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .nav-container {
    padding: 0 1rem;
  }
}

@media (min-width: 769px) {
  .mobile-menu {
    display: none !important;
  }
}
</style>
