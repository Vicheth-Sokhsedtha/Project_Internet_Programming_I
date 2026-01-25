<template>
  <div class="cart-page">
    <h1>Your Cart</h1>
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <button @click="goToProductPage" class="btn-add-products">Add Products</button>
    </div>
    <div v-else>
      <CartItem
        v-for="item in cartStore.items"
        :key="item.id"
        :item="item"
        @update:qty="cartStore.updateQty"
        @update:size="cartStore.updateSize"
        @remove="cartStore.removeItem"
      />
      <div class="cart-summary">
        <p><strong>Subtotal:</strong> ${{ cartStore.subtotal.toFixed(2) }}</p>
        <div class="cart-actions">
          <button @click="goToProductPage" class="btn-update">Update Products</button>
          <button @click="goToCheckout" class="btn-checkout">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import CartItem from '../components/CartItem.vue';

export default defineComponent({
  name: 'CartPage',
  components: { CartItem },
  setup() {
    const router = useRouter();
    const cartStore = useCartStore();

    const goToProductPage = () => {
      router.push({ name: 'product' }); // ✅ product listing page
    };

    const goToCheckout = () => {
      router.push({ name: 'checkout' });
    };


    return {
      cartStore,
      goToProductPage,
      goToCheckout
    };
  }
});


</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background-color: #D9CFC7;
}
h1 {
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.btn-add-products {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
}

.cart-summary {
  margin-top: 2rem;
  padding: 1.5rem;
  border-top: 2px solid #eee;
  text-align: right;
}

.cart-summary p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-update {
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-checkout {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.btn-add-products:hover,
.btn-update:hover,
.btn-checkout:hover {
  opacity: 0.9;
}
</style>
