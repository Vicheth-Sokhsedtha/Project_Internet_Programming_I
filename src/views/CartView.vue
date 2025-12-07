<template>
  <div class="cart-container">
    <h2 class="title">My Carts</h2>

    <div class="cart-list">
      <CartItem
        v-for="item in cart"
        :key="item.id"
        :item="item"
        @update:qty="updateQty"
        @remove="removeItem"
      />
    </div>

    <div class="cart-footer">
      <div class="summary">
        <span class="label">Subtotal:</span>
        <span class="value">${{ subtotal.toFixed(2) }}</span>
      </div>

      <div class="actions">
        <button class="btn btn-buy" @click="buy">Buy</button>
        <button class="btn btn-upgrade" @click="upgradeCart">Upgrade Cart</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import CartItem from '@/components/CartItem.vue';

type CartItemType = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export default defineComponent({
  name: 'CartView',
  components: { CartItem },
  setup() {
    const cart = reactive<CartItemType[]>([
      { id: 1, name: 'Summer dress', price: 25.0, qty: 1 },
      { id: 2, name: 'Summer dress', price: 25.0, qty: 1 },
      { id: 3, name: 'Summer dress', price: 25.0, qty: 1 }
    ]);

    const subtotal = computed(() =>
      cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    );

    const updateQty = (id: number, qty: number) => {
      const found = cart.find((i) => i.id === id);
      if (found) found.qty = Math.max(1, qty);
    };

    const removeItem = (id: number) => {
      const idx = cart.findIndex((i) => i.id === id);
      if (idx !== -1) cart.splice(idx, 1);
    };

    const buy = () => {
      alert(`Buying ${cart.length} item(s) — Total $${subtotal.value.toFixed(2)}`);
    };

    const upgradeCart = () => {
      alert('Upgrade Cart clicked — imagine applying premium packaging or faster shipping.');
    };

    return { cart, subtotal, updateQty, removeItem, buy, upgradeCart };
  }
});
</script>

<style scoped>
.cart-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 16px;
  text-align: left;
}

.cart-list {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed #ddd;
  padding-top: 16px;
}

.summary .label {
  font-weight: 700;
  margin-right: 8px;
}

.summary .value {
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.btn-buy {
  background: #28a745; /* green */
  color: #fff;
}

.btn-upgrade {
  background: #1e90ff; /* blue */
  color: #fff;
}

.btn:hover {
  opacity: 0.9;
}
</style>
