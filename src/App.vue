<template>
  <div id="app">
    <nav>
      <router-link to="/">Products</router-link> |
      <router-link to="/cart">Cart ({{ cartStore.itemCount }})</router-link> |
      <router-link to="/checkout">Checkout</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCartStore } from './stores/cart';

export default defineComponent({
  name: 'App',
  setup() {
    const cartStore = useCartStore();

    return {
      cartStore
    };
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 1rem;
  background: #f5f5f5;
  text-align: center;
  margin-bottom: 2rem;
}

nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a:hover {
  color: #007bff;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
