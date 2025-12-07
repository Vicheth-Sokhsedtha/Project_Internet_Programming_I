<template>
  <div class="checkout-view">
    <h1>Checkout Page</h1>
    <!-- Call the component here -->
    <CheckoutCart />
  </div>
</template>

<script lang="ts">
import CheckoutCart from '@/components/CheckoutCart.vue';

export default {
  name: 'CheckoutView',
  components: {
    CheckoutCart
  }
};
</script>
